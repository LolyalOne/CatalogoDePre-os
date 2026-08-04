import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA-q8LKOGlbbRo9blAiOqN69C10ou7swTU',
  authDomain: 'espeto-f-cil-menu.firebaseapp.com',
  databaseURL: 'https://espeto-f-cil-menu-default-rtdb.firebaseio.com',
  projectId: 'espeto-f-cil-menu',
  storageBucket: 'espeto-f-cil-menu.firebasestorage.app',
  messagingSenderId: '549217212218',
  appId: '1:549217212218:web:81756bb071311cfdd92203',
  measurementId: 'G-91Z5GLT7QE'
};

const app = initializeApp(firebaseConfig);

// Habilitar cache offline para tolerar pequenas falhas de rede usando o novo padrão
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});

export const auth = getAuth(app);

