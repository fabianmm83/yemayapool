import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { FirebaseErrorBoundary } from "./components/common/FirebaseErrorBoundary";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <FirebaseErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pb-20 md:pb-8 pt-16"> {/* Añadí pt-16 para espacio del navbar */}
              <AppRoutes />
            </main>
            
            {/* Footer móvil - Mejorado */}
            <footer className="mobile-bottom-nav md:hidden">
              <div className="flex justify-around items-center h-full">
                <a 
                  href="/dashboard" 
                  className="mobile-bottom-nav-item flex flex-col items-center justify-center"
                >
                  <div className="h-6 w-6 mb-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <span className="text-xs">Inicio</span>
                </a>
                
                <a 
                  href="/admin/tables" 
                  className="mobile-bottom-nav-item flex flex-col items-center justify-center"
                >
                  <div className="h-6 w-6 mb-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs">Mesas</span>
                </a>
                
                <button 
                  className="mobile-bottom-nav-item flex flex-col items-center justify-center relative"
                  onClick={() => {
                    // Aquí iría la lógica para crear nueva sesión
                    console.log('Nueva sesión');
                  }}
                >
                  <div className="h-12 w-12 -mt-6 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                    <span className="text-xl font-bold">+</span>
                  </div>
                  <span className="text-xs mt-2">Nueva</span>
                </button>
                
                <a 
                  href="/customers" 
                  className="mobile-bottom-nav-item flex flex-col items-center justify-center"
                >
                  <div className="h-6 w-6 mb-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs">Clientes</span>
                </a>
                
                <a 
                  href="/profile" 
                  className="mobile-bottom-nav-item flex flex-col items-center justify-center"
                >
                  <div className="h-6 w-6 mb-1">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs">Perfil</span>
                </a>
              </div>
            </footer>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </FirebaseErrorBoundary>
  );
}

export default App;