import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, onAuthStateChanged } from 'firebase/auth';

const LoginForm = ({ onClose, onSuccessfulLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState('');
  const [user, setUser] = useState(null); // Guardar estado de usuario autenticado
  const navigate = useNavigate();

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Aquí puedes manejar el inicio de sesión exitoso
        if (onSuccessfulLogin) {
          onSuccessfulLogin(); // Llama a la función de inicio de sesión exitoso
        }
        navigate('/home'); // Si el usuario está autenticado, redirige
      }
    });

    return () => unsubscribe();
  }, [navigate, onSuccessfulLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        setLoginMessage('Logueado correctamente');
        if (onSuccessfulLogin) {
          onSuccessfulLogin(); // Llama a la función de inicio de sesión exitoso
        }
        navigate('/home'); // Redirige al usuario después de iniciar sesión
      } else {
        setLoginMessage('Por favor, verifica tu correo antes de iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setLoginMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      if (onSuccessfulLogin) {
        onSuccessfulLogin(); // Llama a la función de inicio de sesión exitoso
      }
      navigate('/home'); // Redirige al usuario después de iniciar sesión
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setLoginMessage('Error al iniciar sesión con Google.');
    }
  };

  const handleGoRegister = () => {
    onClose();
    navigate('/register'); // Redirige al formulario de registro
  };

  return (
    <>
    <button 
        onClick={onClose} 
        className="absolute top-4 left-4 text-red-600 font-extrabold z-40">
        <img
        className="w-12 h-12"
        src="/exit.webp">
        </img>
    </button>

    <div className='w-screen h-screen z-30 bg-black absolute top-0 bottom-0 bg-opacity-70' onClick={onClose}></div>
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 w-full max-w-lg mx-auto shadow-lg z-50">

      <div className="mb-4 text-left">
        <h2 className="text-2xl font-bold text-c mb-2">Iniciar sesión</h2>
      </div>

      <div className="mb-4">
        <input 
          type="email" 
          placeholder="Ingrese su correo" 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <input 
          type="password" 
          placeholder="Ingrese su contraseña" 
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Link a olvidaste tu contraseña */}
      <div className="mb-2 text-right">
        <a href="/forgot-password" className="text-c">¿Olvidaste tu contraseña?</a>
      </div>


      <div className="flex flex-col gap-4 text-center font-semibold">
        <button 
          onClick={handleLogin}
          className="bg-b1 border py-3 rounded-3xl hover:bg-c hover:text-b1 text-c">
          Ingresar
        </button>

        <button 
          onClick={handleGoRegister}
          className="bg-b1 border py-3 rounded-3xl hover:bg-c hover:text-b1 mb-6 text-c">
          Registrarse
        </button>

        {loginMessage && <p className="text-red-500 mb-4 text-center">{loginMessage}</p>}
      </div>
    </div>
    </>
  );
};

export default LoginForm;
