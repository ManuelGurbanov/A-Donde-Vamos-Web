import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import screen1 from '../img/screen1.png';
import screen3 from '../img/screen3.png';
import screen4 from '../img/screen4.png';

const Layout = () => {
  return (
    <div className="flex flex-col w-screen h-screen bg-zinc-900 sm:max-w-lg">
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
      <div className="fixed bottom-0 flex items-center justify-around w-full h-16 text-white bg-gray-800 sm:max-w-lg">
        <Link to="/home" className="w-12">
          <img src={screen1} alt="Pantalla 1" />
        </Link>
        <Link to="/coffee-all" className="w-12">
          <img src={screen1} alt="Pantalla 4" />
        </Link>
        <Link to="/add" className="w-12">
          <img src={screen3} alt="Pantalla 4" />
        </Link>
        <Link to="/login" className="w-12">
          <img src={screen4} alt="Pantalla 4" />
        </Link>
      </div>
    </div>
  );
};

export default Layout;