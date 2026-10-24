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

const BLOGS_COLLECTION = 'blogs';

export const blogService = {
  async getBlogs() {
    try {
      const snap = await getDocs(collection(db, BLOGS_COLLECTION));
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          title: data.title || 'Untitled Blog',
          author: data.author || 'Admin',
          content: data.content || '',
          imageUrl: data.imageUrl || null,
          commentCount: Number(data.commentCount || 0),
          createdAtDate: data.createdAt ? (typeof data.createdAt === 'number' ? new Date(data.createdAt) : data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date()
        };
      });
    } catch (err) {
      console.error('Error fetching blogs:', err);
      throw err;
    }
  },

  async addBlog(blog) {
    try {
      const payload = {
        title: blog.title.trim(),
        content: blog.content.trim(),
        author: blog.author?.trim() || 'Admin',
        imageUrl: blog.imageUrl || null,
        commentCount: 0,
        createdAt: Date.now()
      };
      const ref = await addDoc(collection(db, BLOGS_COLLECTION), payload);
      return { id: ref.id, ...payload };
    } catch (err) {
      console.error('Error adding blog:', err);
      throw err;
    }
  },

  async updateBlog(id, updates) {
    try {
      await updateDoc(doc(db, BLOGS_COLLECTION, id), updates);
      return true;
    } catch (err) {
      console.error('Error updating blog:', err);
      throw err;
    }
  },

  async deleteBlog(id) {
    try {
      await deleteDoc(doc(db, BLOGS_COLLECTION, id));
      return true;
    } catch (err) {
      console.error('Error deleting blog:', err);
      throw err;
    }
  }
};
