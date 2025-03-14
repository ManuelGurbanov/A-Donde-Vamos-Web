import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/firebase';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const DeleteAccount = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta y todos los datos asociados? Esta acción no se puede deshacer.'
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      alert('Tu cuenta ha sido eliminada correctamente.');
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      alert('Hubo un problema al eliminar la cuenta. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="text-center p-4">
        {showLogin && <LoginForm dontGoHome onClose={() => setShowLogin(false)} />} 
      <p className="mt-4 text-lg text-gray-600">
        Para solicitar la eliminación de su cuenta de <strong>A Dónde Vamos</strong>, inicie sesión y haga clic en "Eliminar Cuenta".
        Esto eliminará su perfil y los datos asociados.
      </p>
      {user ? (
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-800"
        >
          Eliminar Cuenta
        </button>
      ) : (
        <button
          onClick={() => setShowLogin(true)}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-800"
        >
          Iniciar sesión
        </button>
      )}

    </div>
  );
};

export default DeleteAccount;
