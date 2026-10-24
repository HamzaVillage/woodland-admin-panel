import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

export const userService = {
  /**
   * Fetch all registered users
   */
  async getAllUsers() {
    try {
      const q = collection(db, USERS_COLLECTION);
      const snapshot = await getDocs(q);
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        let createdAtDate = new Date();
        if (data.createdAt?.toDate) {
          createdAtDate = data.createdAt.toDate();
        } else if (typeof data.createdAt === 'number') {
          createdAtDate = new Date(data.createdAt);
        } else if (typeof data.createdAt === 'string') {
          createdAtDate = new Date(data.createdAt);
        }

        let lastLoginDate = null;
        if (data.lastLoginAt?.toDate) {
          lastLoginDate = data.lastLoginAt.toDate();
        } else if (typeof data.lastLoginAt === 'number') {
          lastLoginDate = new Date(data.lastLoginAt);
        } else if (typeof data.lastLoginAt === 'string') {
          lastLoginDate = new Date(data.lastLoginAt);
        }

        return {
          id: doc.id,
          name: data.name || data.displayName || 'Unnamed User',
          email: data.email || 'No email provided',
          phoneNumber: data.phoneNumber || null,
          profileImageUrl: data.profileImageUrl || data.photoURL || null,
          role: data.role || 'user',
          createdAt: createdAtDate,
          lastLoginAt: lastLoginDate,
          ...data
        };
      });

      // Sort newest users first
      users.sort((a, b) => b.createdAt - a.createdAt);
      return users;
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      throw error;
    }
  },

  /**
   * Update user details (e.g. role, active status)
   */
  async updateUser(userId, updates) {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(docRef, updates);
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Delete a user record
   */
  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, USERS_COLLECTION, userId));
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  /**
   * Compute admin dashboard metrics from collections
   */
  async getDashboardStats() {
    try {
      const [users, booksSnap] = await Promise.all([
        this.getAllUsers(),
        getDocs(collection(db, 'books'))
      ]);

      const totalUsers = users.length;
      const normalUsers = users.filter(u => u.role !== 'admin').length;
      const adminUsers = users.filter(u => u.role === 'admin').length;

      const books = booksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const totalBooks = books.length;
      const publishedBooks = books.filter(b => b.isPublished).length;
      const draftBooks = books.filter(b => !b.isPublished).length;
      const ebooksCount = books.filter(b => b.type === 'ebook' && !b.isFolder).length;
      const audiobooksCount = books.filter(b => b.type === 'audiobook').length;
      const foldersCount = books.filter(b => b.isFolder || b.category === 'Folder').length;

      // Unique categories
      const categories = [...new Set(books.map(b => b.category).filter(Boolean))];

      // Active today: logged in in the last 24h
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeToday = users.filter(u => u.lastLoginAt && u.lastLoginAt >= oneDayAgo).length;

      // Total reads & listens aggregated
      const totalReads = books.reduce((sum, b) => sum + (Number(b.readCount) || Number(b.viewCount) || 0), 0);
      const totalListens = books.reduce((sum, b) => sum + (Number(b.listenCount) || Number(b.listenedUserCount) || 0), 0);

      return {
        totalUsers,
        normalUsers,
        adminUsers,
        totalBooks,
        publishedBooks,
        draftBooks,
        ebooksCount,
        audiobooksCount,
        foldersCount,
        categoriesCount: categories.length,
        categories,
        activeToday,
        totalReads,
        totalListens,
        recentUsers: users.slice(0, 5)
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return {
        totalUsers: 0,
        normalUsers: 0,
        adminUsers: 0,
        totalBooks: 0,
        publishedBooks: 0,
        draftBooks: 0,
        ebooksCount: 0,
        audiobooksCount: 0,
        foldersCount: 0,
        categoriesCount: 0,
        categories: [],
        activeToday: 0,
        totalReads: 0,
        totalListens: 0,
        recentUsers: []
      };
    }
  }
};
