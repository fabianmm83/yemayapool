import React, { Component, type ReactNode, type ErrorInfo } from 'react';
import { type AuthError } from 'firebase/auth';
import { type FirestoreError } from 'firebase/firestore';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class FirebaseErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      errorInfo
    });

    // Log error to analytics service if available
    console.error('Firebase Error Boundary caught an error:', error, errorInfo);
    
    // You can log to Firebase Analytics here if configured
    // if (analytics) {
    //   logEvent(analytics, 'app_error', {
    //     error_message: error.message,
    //     error_stack: error.stack,
    //     component_stack: errorInfo.componentStack
    //   });
    // }
  }

  // Helper para identificar el tipo de error
  private getErrorMessage(): string {
    const { error } = this.state;

    if (!error) return 'Error desconocido';

    // Errores de Firebase Auth
    if (error.name.includes('FirebaseError') || (error as AuthError).code) {
      const authError = error as AuthError;
      switch (authError.code) {
        case 'auth/invalid-email':
          return 'Correo electrónico inválido';
        case 'auth/user-disabled':
          return 'Usuario deshabilitado';
        case 'auth/user-not-found':
          return 'Usuario no encontrado';
        case 'auth/wrong-password':
          return 'Contraseña incorrecta';
        case 'auth/email-already-in-use':
          return 'Correo electrónico ya registrado';
        case 'auth/weak-password':
          return 'Contraseña muy débil';
        case 'auth/network-request-failed':
          return 'Error de conexión de red';
        case 'auth/too-many-requests':
          return 'Demasiados intentos. Intenta más tarde';
        default:
          return `Error de autenticación: ${authError.message}`;
      }
    }

    // Errores de Firestore
    if ((error as FirestoreError).code) {
      const firestoreError = error as FirestoreError;
      switch (firestoreError.code) {
        case 'permission-denied':
          return 'Permiso denegado para acceder a los datos';
        case 'not-found':
          return 'Datos no encontrados';
        case 'unavailable':
          return 'Servicio no disponible. Verifica tu conexión';
        default:
          return `Error de base de datos: ${firestoreError.message}`;
      }
    }

    return error.message;
  }

  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Fallback por defecto
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg 
                  className="w-8 h-8 text-red-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.282 16.5c-.77.833.192 2.5 1.732 2.5z" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Algo salió mal
              </h2>
              <p className="text-gray-600 mb-6">
                {this.getErrorMessage()}
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Intentar nuevamente
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Volver al inicio
              </button>
              
              {import.meta.env.DEV && this.state.errorInfo && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg overflow-auto">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                      Detalles del error (desarrollo)
                    </summary>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {this.state.error?.toString()}
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;