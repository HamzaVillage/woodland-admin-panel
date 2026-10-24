import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

const BOOKS_COLLECTION = 'books';
const FOLDERS_COLLECTION = 'folders';

export const bookService = {
  /**
   * Fetch all books and folders, merged and sorted by position & date
   */
  async getAllBooksAndFolders() {
    try {
      const booksSnapshot = await getDocs(collection(db, BOOKS_COLLECTION));
      const books = booksSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          collectionType: 'books',
          createdAtDate: data.createdAt?.toDate ? data.createdAt.toDate() : (typeof data.createdAt === 'number' ? new Date(data.createdAt) : new Date()),
          updatedAtDate: data.updatedAt?.toDate ? data.updatedAt.toDate() : (typeof data.updatedAt === 'number' ? new Date(data.updatedAt) : new Date()),
          isFolder: Boolean(data.isFolder || data.category === 'Folder' || data.coverImageUrl === 'folder'),
          position: Number(data.position ?? data.sortNumber ?? data.sort_number ?? data.sort ?? data.order ?? 0)
        };
      });

      let folders = [];
      try {
        const foldersSnapshot = await getDocs(collection(db, FOLDERS_COLLECTION));
        folders = foldersSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            collectionType: 'folders',
            createdAtDate: data.createdAt?.toDate ? data.createdAt.toDate() : (typeof data.createdAt === 'number' ? new Date(data.createdAt) : new Date()),
            updatedAtDate: data.updatedAt?.toDate ? data.updatedAt.toDate() : (typeof data.updatedAt === 'number' ? new Date(data.updatedAt) : new Date()),
            isFolder: true,
            position: Number(data.position ?? data.sortNumber ?? data.sort_number ?? data.sort ?? data.order ?? 0)
          };
        });
      } catch (err) {
        console.warn('Folders collection read notice:', err);
      }

      const combined = [...books, ...folders];

      // Sort client-side by position ascending, then fallback to createdAt descending
      combined.sort((a, b) => {
        if (a.position !== b.position) {
          return a.position - b.position;
        }
        return b.createdAtDate - a.createdAtDate;
      });

      return combined;
    } catch (error) {
      console.error('Error in getAllBooksAndFolders:', error);
      throw error;
    }
  },

  /**
   * Add a new book
   */
  async addBook(bookData) {
    try {
      const payload = {
        title: bookData.title || '',
        author: bookData.author || '',
        description: bookData.description || '',
        coverImageUrl: bookData.coverImageUrl || '',
        content: bookData.content || null,
        pdfUrl: bookData.pdfUrl || null,
        audioFileUrl: bookData.audioFileUrl || null,
        chapters: Array.isArray(bookData.chapters) ? bookData.chapters : [],
        category: bookData.category || 'Fiction',
        type: bookData.type || 'ebook',
        readTime: Number(bookData.readTime) || 0,
        listenTime: Number(bookData.listenTime) || 0,
        listenCount: Number(bookData.listenCount) || 0,
        viewCount: Number(bookData.viewCount) || 0,
        readCount: Number(bookData.readCount) || 0,
        listenedUserCount: Number(bookData.listenedUserCount) || 0,
        isPublished: Boolean(bookData.isPublished),
        hasEverBeenPublished: Boolean(bookData.isPublished),
        price: Number(bookData.price) || 0,
        position: Number(bookData.position) || 0,
        language: bookData.language || 'English',
        isFolder: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, BOOKS_COLLECTION), payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      console.error('Error adding book:', error);
      throw error;
    }
  },

  /**
   * Add a new Folder / Collection
   */
  async addFolder(folderData) {
    try {
      const payload = {
        title: folderData.title || '',
        author: folderData.author || 'Woodland Collection',
        description: folderData.description || '',
        coverImageUrl: folderData.coverImageUrl || 'folder',
        category: 'Folder',
        type: 'ebook',
        readTime: 0,
        listenTime: 0,
        isPublished: Boolean(folderData.isPublished),
        hasEverBeenPublished: Boolean(folderData.isPublished),
        price: 0,
        position: Number(folderData.position) || 0,
        language: folderData.language || 'English',
        isFolder: true,
        bookIds: Array.isArray(folderData.bookIds) ? folderData.bookIds : [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, BOOKS_COLLECTION), payload);
      return { id: docRef.id, ...payload };
    } catch (error) {
      console.error('Error adding folder:', error);
      throw error;
    }
  },

  /**
   * Update an existing book or folder
   */
  async updateBook(id, bookData, collectionType = 'books') {
    try {
      const docRef = doc(db, collectionType, id);
      const payload = {
        ...bookData,
        updatedAt: Timestamp.now()
      };
      delete payload.id;
      delete payload.createdAtDate;
      delete payload.updatedAtDate;
      delete payload.collectionType;

      await updateDoc(docRef, payload);
      return { id, ...payload };
    } catch (error) {
      console.error('Error updating book:', error);
      throw error;
    }
  },

  /**
   * Delete book or folder from Firestore
   */
  async deleteBook(id) {
    try {
      try {
        await deleteDoc(doc(db, BOOKS_COLLECTION, id));
      } catch (_) {}
      try {
        await deleteDoc(doc(db, FOLDERS_COLLECTION, id));
      } catch (_) {}
      return true;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  },

  /**
   * Batch update positions for Drag and Drop reordering
   */
  async updatePositions(items) {
    try {
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        const targetCollection = item.collectionType === 'folders' ? FOLDERS_COLLECTION : BOOKS_COLLECTION;
        const ref = doc(db, targetCollection, item.id);
        batch.update(ref, {
          position: index,
          sortNumber: index,
          updatedAt: Timestamp.now()
        });
      });
      await batch.commit();
      return true;
    } catch (error) {
      console.error('Error updating positions:', error);
      throw error;
    }
  }
};
