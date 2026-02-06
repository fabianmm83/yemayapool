import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
  const currentHour = today.getHours();
  const isOpen = (dayOfWeek >= 2 && dayOfWeek <= 6) || dayOfWeek === 0; // Martes a Domingo
  const waitTime = Math.floor(Math.random() * 10) + 10; // 10-20 minutos

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white font-sans">
      {/* Top Navigation - Fixed */}
      <div className="fixed top-0 z-50 w-full bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center p-4 justify-between max-w-md mx-auto">
          <div className="text-emerald-400 flex size-10 items-center justify-center">
            <span className="material-symbols-outlined text-3xl">sports_golf</span>
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-white text-lg font-bold leading-tight tracking-tight">Yemaya Pool & Bar</h2>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-xs">location_on</span>
              Xochimilco, CDMX
            </div>
          </div>
          <div className="flex w-10 items-center justify-end">
            <Link 
              to="/login"
              className="flex items-center justify-center rounded-full h-10 w-10 bg-gray-800 border border-white/10 text-white hover:bg-gray-700 transition-colors"
            >
              <span className="material-symbols-outlined">person</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-20 pb-24 max-w-md mx-auto">
        {/* Hero Section */}
        <div className="p-4">
          <div className="relative flex min-h-[440px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl items-center justify-center p-6 text-center border border-white/5" 
               style={{
                 backgroundImage: 'linear-gradient(rgba(5, 5, 5, 0.4) 0%, rgba(5, 5, 5, 0.9) 100%), url("https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")'
               }}>
            <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full border ${isOpen ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
              <span className={`text-xs font-bold uppercase tracking-tighter ${isOpen ? 'text-emerald-400' : 'text-red-400'}`}>
                {isOpen ? 'Abierto ahora' : 'Cerrado'}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-white text-5xl font-black leading-none tracking-tighter">
                SIENTE LA <br/> <span className="text-emerald-400 text-shadow-lg shadow-emerald-500/50">VIBRA</span> NOCTURNA
              </h1>
              <p className="text-gray-300 text-base font-medium max-w-[280px] mx-auto">
                Pool & Beer en el corazón místico de Xochimilco.
              </p>
            </div>
            <div className="flex flex-col w-full gap-3 mt-4">
              <Link 
                to="/login"
                className="flex w-full cursor-pointer items-center justify-center rounded-full h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-900 text-lg font-black uppercase tracking-tight hover:from-emerald-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/25"
              >
                <span className="material-symbols-outlined mr-2">calendar_today</span>
                Reservar Mesa
              </Link>
              <button className="flex w-full cursor-pointer items-center justify-center rounded-full h-14 bg-white/10 backdrop-blur-md text-white border border-white/20 text-lg font-bold hover:bg-white/20 transition-colors">
                Ver Menú Completo
              </button>
            </div>
          </div>
        </div>

        {/* Section Header: Promo */}
        <div className="px-4 flex items-center justify-between mt-6">
          <h3 className="text-white text-2xl font-black tracking-tight uppercase italic underline decoration-emerald-500 decoration-4 underline-offset-4">
            Promo del Día
          </h3>
          <span className="text-amber-400 text-xs font-bold uppercase flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">bolt</span>
            Exclusivo Hoy
          </span>
        </div>

        {/* Featured Promo Card */}
        <div className="p-4">
          <div className="flex flex-col items-stretch justify-start rounded-xl shadow-2xl bg-gray-800 border-2 border-emerald-500/40 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 font-black text-xs px-8 py-4 rotate-12 shadow-lg">
              HOT DEAL
            </div>
            <div className="w-full bg-center bg-no-repeat aspect-[16/9] bg-cover"
                 style={{
                   backgroundImage: 'url("https://images.unsplash.com/photo-1535957998253-26ae1ef29506?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")'
                 }}>
            </div>
            <div className="flex w-full flex-col gap-2 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white text-2xl font-black leading-none">CUBETAZO + 1HR BILLAR</p>
                  <p className="text-emerald-400/80 text-sm font-bold mt-1">Válido de Lun a Jue • Todo el día</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 text-2xl font-black leading-none">$350</p>
                  <p className="text-gray-400 text-[10px] uppercase font-bold">MXN</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-snug">
                Perfecto para compartir con 4 amigos. Incluye 6 cervezas nacionales bien frías y mesa profesional.
              </p>
              <Link 
                to="/login"
                className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-900 text-base font-black uppercase hover:from-emerald-600 hover:to-cyan-600 transition-all"
              >
                Aprovechar Ahora
              </Link>
            </div>
          </div>
        </div>

        {/* Section Header: Food & Drinks */}
        <div className="px-4 mt-4 flex items-center justify-between">
          <h3 className="text-white text-2xl font-black tracking-tight uppercase">Para Picar & Frías</h3>
          <button className="text-emerald-400 text-sm font-bold underline italic uppercase tracking-tighter hover:text-emerald-300 transition-colors">
            Ver todo
          </button>
        </div>

        {/* Horizontal Menu Carousel */}
        <div className="flex overflow-x-auto gap-4 p-4 pb-6 scrollbar-hide">
          {/* Item 1 */}
          <div className="flex-none w-64 rounded-xl bg-gray-800 border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-colors">
            <div className="h-40 bg-cover bg-center"
                 style={{
                   backgroundImage: 'url("https://images.unsplash.com/photo-1608039755401-742074f0548d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")'
                 }}>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold text-lg">Alitas Yemaya</span>
                <span className="text-emerald-400 font-black">$185</span>
              </div>
              <p className="text-gray-400 text-xs font-medium">10 piezas con salsa secreta de la casa y dip blue cheese.</p>
            </div>
          </div>
          
          {/* Item 2 */}
          <div className="flex-none w-64 rounded-xl bg-gray-800 border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-colors">
            <div className="h-40 bg-cover bg-center"
                 style={{
                   backgroundImage: 'url("https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")'
                 }}>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold text-lg">Nachos Locos</span>
                <span className="text-emerald-400 font-black">$160</span>
              </div>
              <p className="text-gray-400 text-xs font-medium">Con mucho queso, jalapeños, chili beans y guacamole fresco.</p>
            </div>
          </div>
          
          {/* Item 3 */}
          <div className="flex-none w-64 rounded-xl bg-gray-800 border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-colors">
            <div className="h-40 bg-cover bg-center"
                 style={{
                   backgroundImage: 'url("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80")'
                 }}>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-bold text-lg">Draft Golden</span>
                <span className="text-emerald-400 font-black">$85</span>
              </div>
              <p className="text-gray-400 text-xs font-medium">Cerveza de barril ultra fría servida en tarro escarchado.</p>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 flex flex-col items-center text-center gap-2 hover:border-emerald-500/30 transition-colors">
            <span className="material-symbols-outlined text-emerald-400 text-3xl">timer</span>
            <p className="text-xs font-bold uppercase text-gray-400">Espera actual</p>
            <p className="text-xl font-black text-white">~{waitTime} MIN</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-white/10 flex flex-col items-center text-center gap-2 hover:border-amber-500/30 transition-colors">
            <span className="material-symbols-outlined text-amber-400 text-3xl">music_note</span>
            <p className="text-xs font-bold uppercase text-gray-400">En la mezcla</p>
            <p className="text-xl font-black text-white">DJ NIGHT</p>
          </div>
        </div>

        {/* Location & Hours Section */}
        <div className="p-4">
          <div className="bg-gray-800 rounded-xl border border-white/10 overflow-hidden hover:border-emerald-500/30 transition-colors">
            <div className="h-32 bg-cover bg-center opacity-70"
                 style={{
                   backgroundImage: 'url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80")'
                 }}>
            </div>
            <div className="p-4">
              {/* Location */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="material-symbols-outlined text-emerald-400 mr-2">location_on</span>
                    <h3 className="text-white font-bold text-lg">Ubicación</h3>
                  </div>
                  <a 
                    href="https://maps.google.com/?q=Av.+5+de+Mayo+33-43,+Santa+Crucita,+Xochimilco+16070+Ciudad+de+México"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-500/10 text-emerald-400 p-2 rounded-full border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">directions</span>
                  </a>
                </div>
                <p className="text-white font-bold">Av. 5 de Mayo 33-43</p>
                <p className="text-gray-400 text-sm">Santa Crucita, Xochimilco 16070 CDMX</p>
                <p className="text-gray-500 text-xs mt-1">+52 55 1234 5678</p>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center mb-4">
                  <span className="material-symbols-outlined text-amber-400 mr-2">schedule</span>
                  <h3 className="text-white font-bold text-lg">Horario</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Martes a Domingo</span>
                    <span className={`font-bold ${isOpen ? 'text-emerald-400' : 'text-gray-500'}`}>
                      2:00 PM - 7:00 AM
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Lunes</span>
                    <span className="text-red-400 font-bold">Cerrado</span>
                  </div>
                  <div className={`text-xs text-center mt-3 px-3 py-1 rounded-full ${isOpen ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {isOpen ? '✅ Estamos abiertos ahora' : '❌ Cerrado - Abrimos mañana a las 2:00 PM'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">
              ¿Listo para la experiencia Yemaya?
            </h3>
            <p className="text-gray-300 text-center mb-6">
              Crea tu cuenta ahora y desbloquea beneficios exclusivos
            </p>
            <div className="flex flex-col gap-3">
              <Link 
                to="/register"
                className="flex w-full cursor-pointer items-center justify-center rounded-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-900 text-base font-black uppercase hover:from-emerald-600 hover:to-cyan-600 transition-all"
              >
                Crear cuenta gratis
              </Link>
              <Link 
                to="/login"
                className="flex w-full cursor-pointer items-center justify-center rounded-full h-12 bg-white/10 backdrop-blur-md text-white border border-white/20 text-base font-bold hover:bg-white/20 transition-colors"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bottom Navigation - Solo opciones públicas */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-50">
        <div className="bg-gray-900/90 border border-white/10 backdrop-blur-xl rounded-full p-2 shadow-2xl flex items-center justify-between">
          <button className="flex items-center justify-center size-12 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-900">
            <span className="material-symbols-outlined font-bold">home</span>
          </button>
          <button className="flex items-center justify-center size-12 rounded-full text-gray-400 hover:text-emerald-400 transition-colors">
            <span className="material-symbols-outlined">restaurant</span>
          </button>
          <Link 
            to="/login"
            className="flex items-center justify-center size-12 rounded-full text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <span className="material-symbols-outlined">login</span>
          </Link>
          <button className="flex items-center justify-center size-12 rounded-full text-gray-400 hover:text-emerald-400 transition-colors">
            <span className="material-symbols-outlined">location_on</span>
          </button>
          <Link 
            to="/register"
            className="flex items-center justify-center size-12 rounded-full text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <span className="material-symbols-outlined">person_add</span>
          </Link>
        </div>
      </div>

      {/* Material Icons CDN */}
      <link 
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        rel="stylesheet"
      />
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .text-shadow-lg {
          text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;