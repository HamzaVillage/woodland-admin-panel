import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const VIDEOS_COLLECTION = 'youtube_videos';
const MP3_COLLECTION = 'mp3';

export const mediaService = {
  // YouTube Videos
  async getYoutubeVideos() {
    try {
      const snap = await getDocs(collection(db, VIDEOS_COLLECTION));
      const list = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        isPublished: d.data().isPublished ?? true,
        thumbnailUrl: d.data().thumbnailUrl || (d.data().videoId ? `https://img.youtube.com/vi/${d.data().videoId}/hqdefault.jpg` : '')
      }));
      return list;
    } catch (err) {
      console.error('Error fetching youtube videos:', err);
      throw err;
    }
  },

  async addYoutubeVideo(video) {
    try {
      const payload = {
        videoId: video.videoId.trim(),
        title: video.title.trim(),
        description: video.description?.trim() || '',
        thumbnailUrl: video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId.trim()}/hqdefault.jpg`,
        isPublished: Boolean(video.isPublished ?? true),
        createdAt: Timestamp.now()
      };
      const ref = await addDoc(collection(db, VIDEOS_COLLECTION), payload);
      return { id: ref.id, ...payload };
    } catch (err) {
      console.error('Error adding video:', err);
      throw err;
    }
  },

  async updateVideoStatus(id, isPublished) {
    try {
      await updateDoc(doc(db, VIDEOS_COLLECTION, id), { isPublished });
      return true;
    } catch (err) {
      console.error('Error updating video status:', err);
      throw err;
    }
  },

  async deleteYoutubeVideo(id) {
    try {
      await deleteDoc(doc(db, VIDEOS_COLLECTION, id));
      return true;
    } catch (err) {
      console.error('Error deleting video:', err);
      throw err;
    }
  },

  // MP3 Audios
  async getMp3s() {
    try {
      const snap = await getDocs(collection(db, MP3_COLLECTION));
      const list = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        isPublished: d.data().isPublished ?? true
      }));
      return list;
    } catch (err) {
      console.error('Error fetching mp3 tracks:', err);
      throw err;
    }
  },

  async addMp3(mp3) {
    try {
      const payload = {
        title: mp3.title.trim(),
        url: mp3.url.trim(),
        isPublished: Boolean(mp3.isPublished ?? true),
        createdAt: new Date().toISOString()
      };
      const ref = await addDoc(collection(db, MP3_COLLECTION), payload);
      return { id: ref.id, ...payload };
    } catch (err) {
      console.error('Error adding mp3:', err);
      throw err;
    }
  },

  async updateMp3Status(id, isPublished) {
    try {
      await updateDoc(doc(db, MP3_COLLECTION, id), { isPublished });
      return true;
    } catch (err) {
      console.error('Error updating mp3 status:', err);
      throw err;
    }
  },

  async deleteMp3(id) {
    try {
      await deleteDoc(doc(db, MP3_COLLECTION, id));
      return true;
    } catch (err) {
      console.error('Error deleting mp3:', err);
      throw err;
    }
  }
};
