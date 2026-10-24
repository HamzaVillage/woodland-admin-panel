import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCVnhhni3pVPp-eH12N-GbXrpxqEFmEfpo",
  authDomain: "glennverse-3cf94.firebaseapp.com",
  projectId: "glennverse-3cf94",
  storageBucket: "glennverse-3cf94.firebasestorage.app",
  messagingSenderId: "931656574267",
  appId: "1:931656574267:web:c6399bb68afa39b9b9c31e"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
