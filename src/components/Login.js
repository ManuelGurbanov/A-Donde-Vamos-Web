import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
        setLoginMessage('Logueado correctamente');
      } else {
        setLoggedIn(false);
        setLoginMessage('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuario logueado exitosamente:', user);
      setLoginMessage('Logueado correctamente');
      navigate('/home');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      //setLoginMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Usuario logueado con Google:', user);
      navigate('/home');
    } catch (error) {
      console.error('Error al loguear con Google', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuario deslogueado exitosamente');
      setLoginMessage('Deslogueado correctamente');
      navigate('/home');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const handleGoRegister = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col items-center justify-start">
      {loggedIn ? (
        <div className="w-4/5 p-4 rounded shadow-md sm:w-1/4 bg-zinc-100 mt-28">
          <h2 className="mb-4 text-2xl font-bold text-black">Bienvenido, {auth.currentUser.displayName || 'Usuario'}</h2>
          <button onClick={handleLogout} className="w-full p-2 mb-2 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600">
            Cerrar Sesión
          </button>
          <h2 className="text-green-500">{loginMessage}</h2>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="w-4/5 p-4 rounded shadow-md sm:w-1/4 bg-zinc-100 mt-28">
          <h2 className="mb-4 text-2xl font-bold text-black">Iniciar Sesión</h2>
          <p className='m-3 text-lg font-medium text-black'>Para poder dar reseñas, por favor inicia sesión con Google</p>
          {/* <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <button type="submit" className="w-full p-2 mb-2 text-white transition-all duration-100 bg-blue-500 rounded hover:bg-blue-600">
            Iniciar Sesión
          </button> */}
          <button onClick={handleGoogleLogin} className="w-full p-2 mb-2 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600">
            Ingresar con Google
          </button>
          {/* <button onClick={handleGoRegister} className="w-full p-2 mb-4 text-black transition-all duration-100 rounded bg-zinc-200 hover:bg-zinc-400">
            Registrarme
          </button> */}
          <h2 className={loggedIn ? 'text-green-500' : 'text-red-500'}>{loginMessage}</h2>
        </form>
      )}
    </div>
  );
};

export default Login;
