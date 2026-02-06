import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode
} from 'react';
import { 
  type User, 
  type AuthError 
} from 'firebase/auth';
import { authService, type RegisterData } from '../services/firebase/authService';
import { db } from '../services/firebase/config';
import { 
  doc, 
  getDoc, 
  setDoc, 
  type DocumentSnapshot,
  type DocumentData
} from 'firebase/firestore';

// Definir la interfaz de UserData
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'superadmin' | 'admin' | 'worker';
  createdAt: Date;
  isActive: boolean;
  lastLogin?: Date;
  phoneNumber?: string;
}

// Definir la interfaz del contexto
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: AuthError | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string, 
    password: string, 
    displayName: string, 
    role: UserData['role'],
    phoneNumber?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  updateUserData: (data: Partial<UserData>) => Promise<void>;
  updateProfile: (displayName?: string, photoURL?: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

// Crear el contexto con un valor por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el provider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Cargar datos del usuario de Firestore
  const loadUserData = async (firebaseUser: User): Promise<void> => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc: DocumentSnapshot<DocumentData> = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const userData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || data.displayName || '',
          photoURL: firebaseUser.photoURL || data.photoURL || '',
          role: data.role || 'worker',
          createdAt: data.createdAt?.toDate() || new Date(),
          isActive: data.isActive !== undefined ? data.isActive : true,
          lastLogin: data.lastLogin?.toDate() || new Date(),
          phoneNumber: data.phoneNumber || ''
        };
        setUserData(userData);
      } else {
        // Crear documento si no existe
        const newUserData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          role: 'worker', // Rol por defecto
          createdAt: new Date(),
          isActive: true,
          lastLogin: new Date(),
          phoneNumber: ''
        };
        
        await setDoc(userDocRef, {
          ...newUserData,
          createdAt: new Date(),
          lastLogin: new Date()
        });
        setUserData(newUserData);
      }
    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err as AuthError);
    }
  };

  // Actualizar datos del usuario en Firestore
  const updateUserData = async (data: Partial<UserData>): Promise<void> => {
    if (!user) return;
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, data, { merge: true });
      
      setUserData(prev => prev ? { ...prev, ...data } : null);
    } catch (err) {
      console.error('Error updating user data:', err);
      setError(err as AuthError);
      throw err;
    }
  };

  // Observador de autenticación
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        await loadUserData(currentUser);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Funciones del contexto

  // Iniciar sesión
  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const result = await authService.login({ email, password });
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    setLoading(false);
  };

  // Registrar nuevo usuario
  const register = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: UserData['role'],
    phoneNumber?: string
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const registerData: RegisterData = {
      email,
      password,
      displayName,
      role,
      phoneNumber
    };
    
    const result = await authService.register(registerData);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    setLoading(false);
  };

  // Cerrar sesión
  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const result = await authService.logout();
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    setUser(null);
    setUserData(null);
    setLoading(false);
  };

  // Restablecer contraseña
  const resetPassword = async (email: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    const result = await authService.resetPassword(email);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    setLoading(false);
  };

  // Actualizar perfil (displayName y photoURL)
  const updateProfile = async (displayName?: string, photoURL?: string): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    setLoading(true);
    setError(null);
    
    const result = await authService.updateUserProfile(user, { displayName, photoURL });
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    // Actualizar datos locales
    if (displayName || photoURL) {
      await updateUserData({
        displayName: displayName || userData?.displayName,
        photoURL: photoURL || userData?.photoURL
      });
    }
    
    setLoading(false);
  };

  // Actualizar contraseña
  const updatePassword = async (newPassword: string): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    setLoading(true);
    setError(null);
    
    const result = await authService.updateUserPassword(user, newPassword);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    setLoading(false);
  };

  // Enviar verificación de email
  const sendEmailVerification = async (): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    setLoading(true);
    setError(null);
    
    const result = await authService.sendEmailVerification(user);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    setLoading(false);
  };

  // Eliminar cuenta
  const deleteAccount = async (): Promise<void> => {
    if (!user) throw new Error('No hay usuario autenticado');
    
    setLoading(true);
    setError(null);
    
    const result = await authService.deleteAccount(user);
    
    if (result.error) {
      setError(result.error);
      setLoading(false);
      throw result.error;
    }
    
    setUser(null);
    setUserData(null);
    setLoading(false);
  };

  // Limpiar errores
  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    clearError,
    updateUserData,
    updateProfile,
    updatePassword,
    sendEmailVerification,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;