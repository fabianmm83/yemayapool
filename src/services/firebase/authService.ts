import {
  type User,
  type UserCredential,
  type AuthError,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  updatePassword,
  type Auth,
  type UserInfo,
  sendEmailVerification,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth } from './config';

// Tipos para nuestro sistema
export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'superadmin' | 'admin' | 'worker';
  createdAt: Date;
  isActive: boolean;
  phoneNumber?: string;
  lastLogin?: Date;
}

export interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  role: UserData['role'];
  phoneNumber?: string;
  photoURL?: string; // AÑADIDO AQUÍ
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface UpdateProfileData {
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export interface ReauthenticateData {
  email: string;
  password: string;
}

// Servicio de autenticación completo
export const authService = {
  /**
   * Registro de nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      // Actualizar perfil con nombre de usuario y photoURL si existe
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
        photoURL: data.photoURL // AÑADIDO AQUÍ
      });
      
      return {
        user: userCredential.user,
        error: null
      };
    } catch (error) {
      console.error('Register error:', error);
      return {
        user: null,
        error: error as AuthError
      };
    }
  },

  /**
   * Inicio de sesión
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      return {
        user: userCredential.user,
        error: null
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        user: null,
        error: error as AuthError
      };
    }
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<{ error: AuthError | null }> {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Restablecer contraseña
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Actualizar perfil del usuario
   */
  async updateUserProfile(
    user: User, 
    data: UpdateProfileData
  ): Promise<{ error: AuthError | null }> {
    try {
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: data.photoURL
      });
      
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Actualizar email
   */
  async updateUserEmail(
    user: User, 
    newEmail: string
  ): Promise<{ error: AuthError | null }> {
    try {
      await updateEmail(user, newEmail);
      return { error: null };
    } catch (error) {
      console.error('Update email error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Actualizar contraseña
   */
  async updateUserPassword(
    user: User, 
    newPassword: string
  ): Promise<{ error: AuthError | null }> {
    try {
      await updatePassword(user, newPassword);
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Reautenticar usuario (para operaciones sensibles)
   */
  async reauthenticateUser(
    user: User,
    data: ReauthenticateData
  ): Promise<{ error: AuthError | null }> {
    try {
      const credential = EmailAuthProvider.credential(data.email, data.password);
      await reauthenticateWithCredential(user, credential);
      return { error: null };
    } catch (error) {
      console.error('Reauthentication error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Enviar email de verificación
   */
  async sendEmailVerification(user: User): Promise<{ error: AuthError | null }> {
    try {
      await sendEmailVerification(user);
      return { error: null };
    } catch (error) {
      console.error('Send email verification error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  /**
   * Verificar si hay usuario autenticado
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null;
  },

  /**
   * Obtener token ID del usuario
   */
  async getIdToken(forceRefresh: boolean = false): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) return null;
    
    try {
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Get ID token error:', error);
      return null;
    }
  },

  /**
   * Obtener información básica del usuario
   */
  getUserInfo(user: User): UserInfo | null {
    return user.providerData[0] || null;
  },

  /**
   * Observador de estado de autenticación
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return auth.onAuthStateChanged(callback);
  },

  /**
   * Observador de cambios en ID token
   */
  onIdTokenChanged(callback: (user: User | null) => void) {
    return auth.onIdTokenChanged(callback);
  },

  /**
   * Verificar si el email está verificado
   */
  isEmailVerified(user: User): boolean {
    return user.emailVerified;
  },

  /**
   * Eliminar cuenta de usuario
   */
  async deleteAccount(user: User): Promise<{ error: AuthError | null }> {
    try {
      await user.delete();
      return { error: null };
    } catch (error) {
      console.error('Delete account error:', error);
      return { error: error as AuthError };
    }
  },

  /**
   * Obtener provider ID
   */
  getProviderId(user: User): string {
    return user.providerId;
  },

  /**
   * Obtener metadata del usuario
   */
  getUserMetadata(user: User) {
    return {
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime
    };
  },

  /**
   * Refrescar token
   */
  async refreshToken(): Promise<string | null> {
    return this.getIdToken(true);
  }
};

export default authService;