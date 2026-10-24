export const CLOUDINARY_CONFIG = {
  cloudName: 'dn9cspqmi',
  uploadPreset: 'ml_default',
  apiKey: '387762122261874',
};

/**
 * Upload a file (image, audio, pdf, video) directly to Cloudinary using unsigned upload preset
 * @param {File} file
 * @param {string} folder - target folder (e.g. 'book_covers', 'book_pdfs', 'mp3_audios', 'blogs')
 * @param {function} onProgress - optional progress callback (percentage)
 * @returns {Promise<{ url: string, public_id: string, format: string, bytes: number }>}
 */
export async function uploadToCloudinary(file, folder = 'woodland_uploads', onProgress) {
  const isImage = file.type.startsWith('image/');
  const resourceType = isImage ? 'image' : (file.type.startsWith('audio/') || file.type.startsWith('video/')) ? 'video' : 'raw';
  
  // Note: for PDF and raw files, Cloudinary auto endpoint works best
  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url || data.url,
            public_id: data.public_id,
            format: data.format,
            bytes: data.bytes,
          });
        } catch (err) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        let errMessage = 'Upload failed';
        try {
          const errData = JSON.parse(xhr.responseText);
          errMessage = errData.error?.message || errMessage;
        } catch (_) {}
        reject(new Error(errMessage));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during file upload'));
    };

    xhr.send(formData);
  });
}
