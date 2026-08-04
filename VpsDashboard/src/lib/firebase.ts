import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY_HERE',
  authDomain: 'vps-italia-legacy-db.firebaseapp.com',
  projectId: 'vps-italia-legacy-db',
  storageBucket: 'vps-italia-legacy-db.firebasestorage.app',
  messagingSenderId: '62508633313',
  appId: '1:62508633313:web:51b0d9ad1ac5c5d9217ba0'
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, type User };
