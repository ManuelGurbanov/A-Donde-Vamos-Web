import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Top from './Top';
import { CafeContext } from './CafeContext'; // Asegúrate de importar el contexto

import { doc, getDoc } from 'firebase/firestore'; // Importar Firestore
import CoffeeCard from './CoffeeCard';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [favoriteCafes, setFavoriteCafes] = useState([]); // Estado para cafeterías favoritas

  const navigate = useNavigate();
  const { cafes = [], selectedNeighs, handleNeighSelection } = useContext(CafeContext); // Definir un valor predeterminado para cafes

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        setLoginMessage('Logueado correctamente');
        fetchFavoriteCafes(user.uid); // Pasar el UID del usuario autenticado
      } else {
        setLoggedIn(false);
        setLoginMessage('');
        setFavoriteCafes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchFavoriteCafes = async (uid) => {
    try {
      // Obtener el documento del usuario
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoriteIds = userData.favorites || [];

        // Filtrar cafeterías favoritas usando el estado del contexto
        const favoriteCafes = cafes.filter(cafe => favoriteIds.includes(cafe.id));
        
        setFavoriteCafes(favoriteCafes); // Actualiza el estado con las cafeterías favoritas
      } else {
        setFavoriteCafes([]); // Limpiar la lista si el usuario no existe
      }
    } catch (error) {
      console.error('Error al obtener cafeterías favoritas', error);
      setFavoriteCafes([]); // Limpiar la lista en caso de error
    }
  };

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

  const handleSavePreferences = () => {
    setSaveMessage('Preferencias guardadas');
    setTimeout(() => {
      setSaveMessage('');
    }, 3000); // Mensaje visible por 3 segundos
  };

  // Obtener los barrios únicos del contexto
  const uniqueNeighs = [...new Set(cafes.map(cafe => cafe.neigh))];

  return (
    <div className="flex flex-col items-center justify-start">
      <Top text={"Perfil"} />
      {loggedIn ? (
        <>
          <div className="w-4/5 p-4 mt-12 rounded shadow-md sm:w-1/4 bg-zinc-100">

          <div className='w.full flex'>
          {auth.currentUser.photoURL && (
                <img 
                  src={auth.currentUser.photoURL} 
                  alt="Foto de perfil" 
                  className="object-cover w-24 h-24 mb-4 border border-gray-300 rounded-full"
                />
              )}

            <div className='ml-4'>
              <h2 className="mb-4 text-lg font-bold text-c1">{auth.currentUser.displayName || 'Usuario'}</h2>
              <h2 className="mb-4 text-sm font-thin text-c1">{auth.currentUser.email || 'Usuario'}</h2>
            </div>
          </div>

            


            <button onClick={handleLogout} className="w-full p-2 mb-2 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600">
              Cerrar Sesión
            </button>
          </div>
          

            <h2 className="text-green-500">{loginMessage}</h2>
          {/* Renderizar cafeterías favoritas */}
          <div className="w-4/5 p-4 mt-4 rounded shadow-md sm:w-1/4 bg-zinc-100">
            <h1 className="w-full p-4 text-2xl font-bold text-left text-c1">Mis Cafeterías Favoritas</h1>
            <div className="grid grid-cols-1 gap-4">
              {favoriteCafes.length > 0 ? (
                favoriteCafes.map(cafe => (
                  <CoffeeCard key={cafe.id} cafe={cafe} />
                ))
              ) : (
                <p className="text-center">No tienes cafeterías favoritas.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleLogin} className="w-4/5 p-4 mt-4 rounded shadow-md sm:w-1/4 bg-zinc-100">
          <h2 className="mb-4 text-2xl font-bold text-black">Iniciar Sesión</h2>
          <p className='m-3 text-lg font-medium text-black'>Para poder dar reseñas, por favor inicia sesión con Google</p>
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
          <button type="submit" className="w-full p-2 mb-2 text-white transition-all duration-100 bg-blue-500 rounded hover:bg-blue-600">
            Iniciar Sesión
          </button>
          <button onClick={handleGoogleLogin} className="w-full p-2 mb-2 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600">
            Ingresar con Google
          </button>
          <button onClick={handleGoRegister} className="w-full p-2 mb-4 text-black transition-all duration-100 rounded bg-zinc-200 hover:bg-zinc-400">
            Registrarme
          </button>
          <h2 className={loggedIn ? 'text-green-500' : 'text-red-500'}>{loginMessage}</h2>
        </form>
      )}

      <div className="w-4/5 p-4 mt-4 rounded shadow-md sm:w-1/4 bg-zinc-100">
        <h1 className="w-full p-4 text-2xl font-bold text-left text-c1">Selecciona tus barrios de preferencia</h1>
        <div className="text-center">
          {uniqueNeighs.length > 0 ? (
            uniqueNeighs.map((neigh, index) => (
              <button
                key={index}
                onClick={() => handleNeighSelection(neigh)}
                className={`p-2 m-2 rounded ${selectedNeighs.includes(neigh) ? 'bg-b2 text-c' : 'bg-gray-200 text-b1'}`}
              >
                {neigh}
              </button>
            ))
          ) : (
            <p className="text-center">No hay barrios disponibles.</p>
          )}
        </div>
        <div className='flex flex-col items-center justify-center w-full p-4'>
          <button
            onClick={handleSavePreferences}
            className="w-full h-12 p-1 m-2 text-white rounded-lg bg-b1 hover:bg-b2"
          >
            Guardar Preferencias
          </button> 
          {saveMessage && (
            <p className="mt-2 text-green-500">{saveMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
