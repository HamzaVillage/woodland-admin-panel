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

const QUIZZES_COLLECTION = 'quizzes';

export const quizService = {
  async getQuizzes() {
    try {
      const snap = await getDocs(collection(db, QUIZZES_COLLECTION));
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          title: data.title || '',
          description: data.description || '',
          questions: Array.isArray(data.questions) ? data.questions : [],
          isPublished: data.isPublished ?? true,
          createdAtDate: data.createdAt ? (typeof data.createdAt === 'number' ? new Date(data.createdAt) : data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : new Date()
        };
      });
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      throw err;
    }
  },

  async addQuiz(quiz) {
    try {
      const payload = {
        title: quiz.title.trim(),
        description: quiz.description?.trim() || '',
        questions: quiz.questions || [],
        isPublished: Boolean(quiz.isPublished ?? true),
        createdAt: Date.now()
      };
      const ref = await addDoc(collection(db, QUIZZES_COLLECTION), payload);
      return { id: ref.id, ...payload };
    } catch (err) {
      console.error('Error adding quiz:', err);
      throw err;
    }
  },

  async updateQuiz(id, updates) {
    try {
      await updateDoc(doc(db, QUIZZES_COLLECTION, id), updates);
      return true;
    } catch (err) {
      console.error('Error updating quiz:', err);
      throw err;
    }
  },

  async deleteQuiz(id) {
    try {
      await deleteDoc(doc(db, QUIZZES_COLLECTION, id));
      return true;
    } catch (err) {
      console.error('Error deleting quiz:', err);
      throw err;
    }
  }
};
