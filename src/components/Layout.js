import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import screen1 from '../img/screen1.png';
import screen2 from '../img/screen2.png';
import screen3 from '../img/screen3.png';
import screen4 from '../img/screen4.png';
import review from '../img/review.png';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-screen h-screen bg-c sm:max-w-lg">
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>

      {/* Menú de navegación inferior */}
      <div className="fixed bottom-0 flex items-center w-full h-20 text-white bg-b2 sm:max-w-lg" style={{ borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}>

        {/* Botones de la izquierda */}
        <div className="flex justify-end gap-8" style={{ flexBasis: '35%', flexGrow: 1 }}>
          <Link to="/home" className="flex flex-col items-center justify-center w-6">
            <img
              src={screen1}
              alt="Pantalla 1"
              className={`w-full ${location.pathname === '/home' ? 'scale-105' : 'scale-100'}`}
            />
            <span className={`text-xs ${location.pathname === '/home' ? 'text-c' : 'opacity-0'}`}>Home</span>
          </Link>
          <Link to="/coffee-all" className="flex flex-col items-center justify-center w-6">
            <img
              src={screen2}
              alt="Pantalla 2"
              className={`w-full ${location.pathname === '/coffee-all' ? 'scale-105' : 'scale-100'}`}
            />
            <span className={`text-xs ${location.pathname === '/coffee-all' ? 'text-c' : 'opacity-0'}`}>Coffee</span>
          </Link>
        </div>

        {/* Botón central (Review) */}
        <div className="flex justify-center -translate-y-6" style={{ flexBasis: '30%', flexGrow: 1 }}>
          <div className="relative flex items-center justify-center w-16 h-16 border-4 rounded-full shadow-lg border-b2 bg-c">
            <img src={review} alt="Review" className="w-8 h-8"/>
          </div>
        </div>

        {/* Botones de la derecha */}
        <div className="flex justify-start gap-8" style={{ flexBasis: '35%', flexGrow: 1 }}>
          <Link to="/add" className="flex flex-col items-center justify-center w-6">
            <img
              src={screen3}
              alt="Pantalla 3"
              className={`w-full ${location.pathname === '/add' ? 'scale-105' : 'scale-100'}`}
            />
            <span className={`text-xs ${location.pathname === '/add' ? 'text-c' : 'opacity-0'}`}>Add</span>
          </Link>
          <Link to="/login" className="flex flex-col items-center justify-center w-6">
            <img
              src={screen4}
              alt="Pantalla 4"
              className={`w-full ${location.pathname === '/login' ? 'scale-105' : 'scale-100'}`}
            />
            <span className={`text-xs ${location.pathname === '/login' ? 'text-c' : 'opacity-0'}`}>Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layout;
