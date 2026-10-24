import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('woodland_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to real Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          const userObj = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: userData.name || firebaseUser.displayName || 'Woodland Administrator',
            email: firebaseUser.email,
            role: userData.role || 'admin',
            profileImageUrl: userData.profileImageUrl || firebaseUser.photoURL || null,
          };
          setCurrentUser(userObj);
          localStorage.setItem('woodland_admin_user', JSON.stringify(userObj));
        } catch (err) {
          console.warn('Could not fetch user document:', err);
          const fallbackUser = {
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'Woodland Administrator',
            email: firebaseUser.email,
            role: 'admin',
          };
          setCurrentUser(fallbackUser);
          localStorage.setItem('woodland_admin_user', JSON.stringify(fallbackUser));
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('woodland_admin_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const user = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      
      const adminUser = {
        id: user.uid,
        uid: user.uid,
        name: userData.name || user.displayName || 'Administrator',
        email: user.email,
        role: userData.role || 'admin',
        profileImageUrl: userData.profileImageUrl || user.photoURL || null
      };

      setCurrentUser(adminUser);
      localStorage.setItem('woodland_admin_user', JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    } catch (error) {
      console.error('Firebase Login error:', error);
      let message = 'Invalid login credentials.';
      if (
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/user-not-found'
      ) {
        message = 'Incorrect email or password. Please check your Firebase credentials.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again later.';
      } else if (error.message) {
        message = error.message;
      }
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (_) {}
    setCurrentUser(null);
    localStorage.removeItem('woodland_admin_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, logout, isAuthenticated: Boolean(currentUser) }}>
      {children}
    </AuthContext.Provider>
  );
};
