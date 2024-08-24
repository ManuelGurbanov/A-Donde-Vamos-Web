import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorText('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 10) {
      setErrorText('La contraseña debe tener al menos 10 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: displayName });

      // Enviar correo de verificación
      await sendEmailVerification(user);

      console.log('Usuario registrado exitosamente:', user);
      alert('Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.');
    } catch (error) {
      console.error('Error al registrar usuario', error);

      if (error.code === 'auth/email-already-in-use') {
        setErrorText('El correo electrónico ya está registrado.');
      } else {
        setErrorText('Error al registrar usuario.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <form onSubmit={handleRegister} className="w-4/5 p-4 rounded shadow-md mt-28 sm:w-1/4 bg-zinc-100">
        <h2 className="mb-4 text-2xl font-bold">Registrarse</h2>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nombre"
          className="w-full p-2 mb-2 border rounded"
          required
        />
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar Contraseña"
          className="w-full p-2 mb-2 border rounded"
          required
        />
        <button type="submit" className="w-full p-2 text-white transition-all duration-100 bg-blue-500 rounded hover:bg-blue-600">Registrarse</button>
        {errorText && <p className="mt-2 text-red-500">{errorText}</p>}
      </form>
    </div>
  );
};

export default Register;
