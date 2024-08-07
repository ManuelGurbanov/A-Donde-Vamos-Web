import React, { useState } from 'react';
import { auth, provider } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Usuario logueado exitosamente:', user);
      setLoginMessage('Logueado correctamente');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      setLoginMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Usuario logueado con Google:', user);
      alert('Usuario logueado exitosamente con Google');
    } catch (error) {
      console.error('Error al loguear con Google', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start">
      <form onSubmit={handleLogin} className="w-4/5 p-4 rounded shadow-md sm:w-1/4 bg-zinc-100 mt-28">
        <h2 className="mb-4 text-2xl font-bold text-black">Iniciar Sesión</h2>
        <input
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
        <button type="submit" className="w-full p-2 mb-2 text-white transition-all duration-100 bg-blue-500 rounded hover:bg-blue-600">Iniciar Sesión</button>

        <button onClick={handleGoogleLogin} className="w-full p-2 mb-4 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600">
          Ingresar con Google
        </button>
        
        <h2 className={loggedIn ? 'text-green-500' : 'text-red-500'}>{loginMessage}</h2>
      </form>
    </div>
  );
};

export default Login;
