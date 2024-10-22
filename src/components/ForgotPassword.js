import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

import Top from './Top';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Se ha enviado un enlace para restablecer la contraseña a tu correo.');
      setError('');
    } catch (err) {
      setError('Error al enviar el correo de restablecimiento. Revisa el correo ingresado.');
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
        <Top text="Olvidé Contraseña"/>
      <form onSubmit={handleResetPassword} className="flex flex-col items-start w-4/5 gap-3 p-4 mt-8 rounded sm:w-1/4">
        <h2 className="text-2xl font-semibold text-c2 mb-4">Recuperar Contraseña</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          className="w-full p-2 mb-2 text-black border rounded-2xl bg-b1 placeholder:text-brown"
          required
        />
        <button type="submit" className="w-full p-2 mt-2 rounded-2xl bg-c2 hover:bg-b1 text-b1 hover:text-c2">
          Enviar enlace de recuperación
        </button>
        {message && <p className="mt-4 text-green-500">{message}</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
