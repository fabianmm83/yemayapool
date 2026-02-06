/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Variables de Firebase REQUERIDAS
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  
  // Variables opcionales para desarrollo
  readonly VITE_USE_FIREBASE_EMULATORS?: string
  readonly VITE_FIREBASE_AUTH_EMULATOR_URL?: string
  readonly VITE_FIREBASE_FIRESTORE_EMULATOR_URL?: string
  readonly VITE_FIREBASE_STORAGE_EMULATOR_URL?: string
  readonly VITE_FIREBASE_FUNCTIONS_EMULATOR_URL?: string
  
  // Variables del proyecto
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_VERSION?: string
  readonly VITE_API_URL?: string
  
  // Variables automáticas de Vite
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly BASE_URL: string
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}