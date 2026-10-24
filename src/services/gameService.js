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

const GAMES_COLLECTION = 'games';

export const gameService = {
  async getGames() {
    try {
      const snap = await getDocs(collection(db, GAMES_COLLECTION));
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          title: data.title || '',
          subtitle: data.subtitle || '',
          imageUrl: data.imageUrl || '',
          gameUrl: data.gameUrl || '',
          description: data.description || '',
          category: data.category || 'Trending',
          isPublished: Boolean(data.isPublished)
        };
      });
    } catch (err) {
      console.error('Error fetching games:', err);
      throw err;
    }
  },

  async addGame(game) {
    try {
      const payload = {
        title: game.title.trim(),
        subtitle: game.subtitle?.trim() || '',
        imageUrl: game.imageUrl || '',
        gameUrl: game.gameUrl.trim(),
        description: game.description?.trim() || '',
        category: game.category || 'Trending',
        isPublished: Boolean(game.isPublished),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      const ref = await addDoc(collection(db, GAMES_COLLECTION), payload);
      return { id: ref.id, ...payload };
    } catch (err) {
      console.error('Error adding game:', err);
      throw err;
    }
  },

  async updateGame(id, updates) {
    try {
      await updateDoc(doc(db, GAMES_COLLECTION, id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return true;
    } catch (err) {
      console.error('Error updating game:', err);
      throw err;
    }
  },

  async deleteGame(id) {
    try {
      await deleteDoc(doc(db, GAMES_COLLECTION, id));
      return true;
    } catch (err) {
      console.error('Error deleting game:', err);
      throw err;
    }
  }
};
