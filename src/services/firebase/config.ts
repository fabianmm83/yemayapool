import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  type Auth, 
  connectAuthEmulator 
} from 'firebase/auth';
import { 
  getFirestore, 
  type Firestore, 
  connectFirestoreEmulator 
} from 'firebase/firestore';
import { 
  getStorage, 
  type FirebaseStorage, 
  connectStorageEmulator 
} from 'firebase/storage';
import { 
  getFunctions, 
  type Functions, 
  connectFunctionsEmulator 
} from 'firebase/functions';
import { 
  getAnalytics, 
  type Analytics, 
  isSupported 
} from 'firebase/analytics';


// Configuración de Firebase - USAR import.meta.env DIRECTAMENTE
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Inicializar Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Servicios
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Analytics condicional
export let analytics: Analytics | null = null;

if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Configuración para emuladores en desarrollo
if (import.meta.env.DEV) {
  const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';
  
  if (useEmulators) {
    console.log('🔧 Conectando a emuladores de Firebase...');
    
    // Conectar a emuladores locales
    connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_URL || 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    connectFunctionsEmulator(functions, 'localhost', 5001);
  }
}

// Función para validar la configuración
export const validateFirebaseConfig = (): boolean => {
  const requiredKeys = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ];

  return requiredKeys.every(key => {
    const value = firebaseConfig[key as keyof typeof firebaseConfig];
    return value && value !== 'undefined' && value !== '';
  });
};

export default app;