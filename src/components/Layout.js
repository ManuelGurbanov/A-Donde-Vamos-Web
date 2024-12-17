// Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase'; // Asegúrate de importar auth de Firebase
import { onAuthStateChanged } from 'firebase/auth';
import screen1 from '../img/screen1.webp';
import screen2 from '../img/screen2.png';
import screen3 from '../img/screen3.png';
import screen4 from '../img/screen4.png';
import screen1_selected from '../img/screen1-selected.webp';
import screen2_selected from '../img/screen2-selected.png';
import screen3_selected from '../img/screen3-selected.png';
import screen4_selected from '../img/screen4-selected.png';
import './Nav.css';
import navBg from '../img/nav_bg.png';
import addsquare from '../img/add-square-white.png';
import Review from './Review';
import LoginForm from './LoginForm';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showReview, setShowReview] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleReviewClick = () => {
    setShowReview(prevShowReview => !prevShowReview);
  };

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const handleLoginClick = () => {
    console.log('handleLoginClick');
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      setShowLoginForm(true);
    }
  };

  const handleCloseLoginForm = () => {
    setShowLoginForm(false);
  };

  const handleSuccessfulLogin = () => {
    setShowLoginForm(false);
    navigate('/home');
  };

  const handleSuccessfulRegister = () => {
    setShowLoginForm(false);
    navigate('/home');
  };

  return (
    <div className="layout-container">
      <img className='fixed bottom-0 z-10 w-screen sm:hidden max-w-[430px]' src={navBg} alt="Background" />

      <div className="overflow-y-scroll content-container">
        <Outlet context={{ handleReviewClick }} />
      </div>

      {showReview && (
        <div className="review-popup">
          <Review onClose={handleCloseReview} />
        </div>
      )}

      {showLoginForm && (
        <div className="login-form-popup">
          <div className="login-form-overlay" onClick={handleCloseLoginForm}></div>
          <div className="login-form-container z-50">
            <LoginForm 
              onClose={handleCloseLoginForm} 
              onSuccessfulLogin={handleSuccessfulLogin} 
              onSuccessfulRegister={handleSuccessfulRegister} 
            /> {/* Llamamos el formulario */}
          </div>
        </div>
      )}

      <div className="z-50 bg-transparent navbar sm:bg-b1">
        <div className="navbar-section navbar-left">
          <Link to="/home" className="navbar-link">
            <div className="navbar-icon-container">
              <img
                src={location.pathname === '/home' ? screen1_selected : screen1}
                alt="Pantalla 1"
                className={`navbar-icon ${location.pathname === '/home' ? 'icon-selected' : ''}`}
              />
              <span className={`navbar-text text-c ${location.pathname === '/home' ? '' : 'text-transparent'}`}>Inicio</span>
            </div>
          </Link>
          <Link to="/coffee-all" className="navbar-link">
            <div className="navbar-icon-container">
              <img
                src={location.pathname === '/coffee-all' ? screen2_selected : screen2}
                alt="Pantalla 2"
                className={`navbar-icon ${location.pathname === '/coffee-all' ? 'icon-selected' : 'text-transparent'}`}
              />
              <span className={`navbar-text text-c ${location.pathname === '/coffee-all' ? '' : 'text-transparent'}`}>Cafés</span>
            </div>
          </Link>
        </div>

        <div className="navbar-center bg-c">
          <button onClick={handleReviewClick} className={`review-button ${location.pathname === '/review' ? '' : 'text-transparent'}`}>
            <img src={addsquare} alt="Review" className="review-icon" />
          </button>
        </div>

        <div className="navbar-section navbar-right">
          <Link to="/notifications" className="navbar-link">
            <div className="navbar-icon-container">
              <img
                src={location.pathname === '/notifications' ? screen3_selected : screen3}
                alt="Pantalla 3"
                className={`navbar-icon ${location.pathname === '/notifications' ? 'icon-selected' : ''}`}
              />
              <span className={`navbar-text text-c ${location.pathname === '/notifications' ? '' : 'text-transparent'}`}>Notificaciones</span>
            </div>
          </Link>
          <button onClick={handleLoginClick} className="navbar-link">
  <div className="navbar-icon-container">
    <img
      src={location.pathname.startsWith('/profile') ? screen4_selected : screen4}
      alt="Pantalla 4"
      className={`navbar-icon ${location.pathname.startsWith('/profile') ? 'icon-selected' : ''}`}
    />
    <span className={`navbar-text text-c ${location.pathname.startsWith('/profile') ? '' : 'text-transparent'}`}>
      Perfil
    </span>
  </div>
</button>

        </div>
      </div>
    </div>
  );
};

export default Layout;
