import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, Music, Check, X, Loader2, Link } from 'lucide-react';
import { uploadToCloudinary } from '../../config/cloudinary';

export const MediaUploader = ({ 
  label = 'Upload Media', 
  value = '', 
  onChange, 
  accept = 'image/*', 
  folder = 'woodland_uploads',
  placeholder = 'Click or drag file to upload',
  helperText = 'Upload via Cloudinary or paste direct URL'
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadToCloudinary(file, folder, (percent) => {
        setUploadProgress(percent);
      });
      onChange(result.url);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => {
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isImage = accept.includes('image') || (value && (value.endsWith('.jpg') || value.endsWith('.png') || value.endsWith('.webp') || value.endsWith('.jpeg') || value.includes('image/upload')));
  const isPdf = accept.includes('pdf') || (value && value.endsWith('.pdf'));
  const isAudio = accept.includes('audio') || (value && (value.endsWith('.mp3') || value.endsWith('.wav') || value.endsWith('.m4a')));

  return (
    <div className="form-group">
      <div className="form-label">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--primary)',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Link size={12} /> {showUrlInput ? 'Switch to file upload' : 'Paste direct URL'}
        </button>
      </div>

      {showUrlInput ? (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="https://..."
            value={manualUrl || value}
            onChange={(e) => {
              setManualUrl(e.target.value);
              onChange(e.target.value);
            }}
          />
        </div>
      ) : (
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            accept={accept} 
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {value ? (
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                {isImage && (
                  <img 
                    src={value} 
                    alt="Preview" 
                    style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                )}
                {isPdf && <FileText size={32} color="#F43F5E" />}
                {isAudio && <Music size={32} color="#38BDF8" />}
                
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Uploaded File
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                    {value}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-icon"
                  style={{ width: '32px', height: '32px' }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Replace file"
                >
                  <UploadCloud size={16} />
                </button>
                <button
                  type="button"
                  className="btn-icon"
                  style={{ width: '32px', height: '32px', color: '#F43F5E' }}
                  onClick={() => onChange('')}
                  title="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div 
              className={`dropzone ${dragActive ? 'active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {isUploading ? (
                <div style={{ padding: '10px 0', width: '100%', maxWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
                    <Loader2 size={20} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>Uploading {uploadProgress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--bg-app)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s ease' }} />
                  </div>
                </div>
              ) : (
                <>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(103, 255, 187, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: '4px'
                  }}>
                    <UploadCloud size={22} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                    {placeholder}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    {helperText}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ color: '#F43F5E', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </div>
      )}
    </div>
  );
};
