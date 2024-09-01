import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import screen1 from '../img/screen1.png';
import screen2 from '../img/screen2.png';
import screen3 from '../img/screen3.png';
import screen4 from '../img/screen4.png';
import review from '../img/review.png';

import screen1_selected from '../img/screen1-selected.png';
import screen2_selected from '../img/screen2-selected.png';
import screen3_selected from '../img/screen3-selected.png';
import screen4_selected from '../img/screen4-selected.png';
import navbarBg from '../img/navbar_bg.png'; // Importa la imagen de fondo
import './Nav.css';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="layout-container">
      <div className="content-container">
        <Outlet />
      </div>

      {/* Menú de navegación inferior */}
      <div className="navbar bg-b2">
        <div className='absolute bottom-0 flex items-center w-screen'>
          
        </div>
        {/* Botones de la izquierda */}
        <div className="navbar-section navbar-left">
          <Link to="/home" className="navbar-link">
            <div className="navbar-icon-container">
              <img
                src={location.pathname === '/home' ? screen1_selected : screen1}
                alt="Pantalla 1"
                className={`navbar-icon ${location.pathname === '/home' ? 'icon-selected' : ''}`}
              />
              <span className={`navbar-text ${location.pathname === '/home' ? 'text-selected' : ''}`}>Inicio</span>
            </div>
          </Link>
          <Link to="/coffee-all" className="navbar-link">
            <div className="navbar-icon-container">
              <img
                src={location.pathname === '/coffee-all' ? screen2_selected : screen2}
                alt="Pantalla 2"
                className={`navbar-icon ${location.pathname === '/coffee-all' ? 'icon-selected' : ''}`}
              />
              <span className={`navbar-text ${location.pathname === '/coffee-all' ? 'text-selected' : ''}`}>Cafés</span>
            </div>
          </Link>
        </div>

        {/* Botón central (Review) */}
        <div className="navbar-center">
          {/* Fondo del botón de revisión */}
          <div className="review-background"></div>
          <Link to="/review">
            <div className={`review-button ${location.pathname === '/review' ? 'review-selected' : ''}`}>
              <img src={review} alt="Review" className="review-icon" />
            </div>
          </Link>
        </div>  

        {/* Botones de la derecha */}
        <div className="navbar-section navbar-right">
          <Link to="/notifications" className="navbar-link">
            <div className="navbar-icon-container">
              <img
                src={location.pathname === '/notifications' ? screen3_selected : screen3}
                alt="Pantalla 3"
                className={`navbar-icon ${location.pathname === '/notifications' ? 'icon-selected' : ''}`}
              />
              <span className={`navbar-text ${location.pathname === '/notifications' ? 'text-selected' : ''}`}>Notificaciones</span>
            </div>
          </Link>
          <Link to="/login" className="navbar-link">
            <div className="navbar-icon-container">
              <img
                src={location.pathname === '/login' ? screen4_selected : screen4}
                alt="Pantalla 4"
                className={`navbar-icon ${location.pathname === '/login' ? 'icon-selected' : ''}`}
              />
              <span className={`navbar-text ${location.pathname === '/login' ? 'text-selected' : ''}`}>Perfil</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Layout;
