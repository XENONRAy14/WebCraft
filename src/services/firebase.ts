import { initializeApp } from 'firebase/app';
import { 
  connectFirestoreEmulator, 
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache
} from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

// Initialiser Firestore avec des paramètres de cache optimisés
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});

const auth = getAuth(app);

// Activer la persistance de l'authentification
setPersistence(auth, browserLocalPersistence)
  .catch((err) => {
    console.error('Erreur lors de la configuration de la persistance auth:', err);
  });

if (import.meta.env.MODE === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}

export { db, auth };
export default app;
