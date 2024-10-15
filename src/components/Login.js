import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, provider, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Top from './Top';
import { CafeContext } from './CafeContext'; // Asegúrate de importar el contexto

import { doc, getDoc } from 'firebase/firestore'; // Importar Firestore
import MiniCard from './MiniCard';

import petIcon from '../img/pet.png'; // Icono para pet-friendly
import tacIcon from '../img/tac.png'; // Icono para tac
import veganIcon from '../img/vegan.png'; // Icono para vegano

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [favoriteCafes, setFavoriteCafes] = useState([]); // Estado para cafeterías favoritas
  const [userData, setUserData] = useState(null); // Estado para los datos adicionales del usuario
  const [selectedTab, setSelectedTab] = useState('favorites'); // Estado para manejar la pestaña seleccionada

  const navigate = useNavigate();
  const { cafes = [], selectedNeighs, handleNeighSelection } = useContext(CafeContext);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        setLoginMessage('Logueado correctamente');
        await fetchUserData(user.uid); // Obtener datos adicionales del usuario
        fetchFavoriteCafes(user.uid);
      } else {
        setLoggedIn(false);
        setLoginMessage('');
        setFavoriteCafes([]);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        setUserData(userDoc.data()); // Almacenar los datos del usuario
      } else {
        console.log('No se encontró el documento del usuario');
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
  };

  const fetchFavoriteCafes = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const favoriteIds = userData.favorites || [];

        const favoriteCafes = cafes.filter(cafe => favoriteIds.includes(cafe.id));
        setFavoriteCafes(favoriteCafes);
      } else {
        setFavoriteCafes([]);
      }
    } catch (error) {
      console.error('Error al obtener cafeterías favoritas', error);
      setFavoriteCafes([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoginMessage('Logueado correctamente');
      navigate('/home');
    } catch (error) {
      console.error('Error al iniciar sesión', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      console.error('Error al loguear con Google', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
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
    }, 3000);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Obtener los barrios únicos del contexto
  const uniqueNeighs = [...new Set(cafes.map(cafe => cafe.neigh))];

  return (
    <div className="flex flex-col items-center justify-center">
      <Top text={"Perfil"} />
      {loggedIn ? (
        <>
          <div className="w-4/5 p-4 mt-12 rounded sm:w-1/4">
            <div className="w-full flex items-center">
              {auth.currentUser.photoURL && (
                <img
                  src={auth.currentUser.photoURL}
                  alt="Foto de perfil"
                  className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2"
                />
              )}

              <div className="ml-4 flex flex-col gap-1">
                <h2 className="text-lg font-bold text-c2">{userData?.fullName || 'Nombre Completo'}</h2>
                <h2 className="text-sm font-thin text-c2">{auth.currentUser.displayName || 'Nombre de Usuario'}</h2>
                <h2 className="text-sm font-thin text-c2">
                  {userData?.mainNeighborhood || 'Barrio'}, <strong className="font-bold italic">CABA</strong>
                </h2>
                <button
                  onClick={handleLogout}
                  className="w-full p-2 mb-2 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600 text-xs"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Insignias */}
            <div className="flex gap-4 w-full items-center justify-center mt-6">
              {userData?.showPet && <img className="w-12 h-12" src={petIcon} alt="Pet Friendly" />}
              {userData?.showTac && <img className="w-12 h-12" src={tacIcon} alt="Tac" />}
              {userData?.showVegan && <img className="w-12 h-12" src={veganIcon} alt="Vegano" />}
            </div>

            {/* Descripción o estado */}
            {userData?.description && (
              <p className="text-c2 text-sm text-center mt-4 font-semibold">
                {userData.description}
              </p>
            )}
          </div>

          {/* Pestañas de favoritos y recientes */}
          <div className="w-4/5 flex text-c mt-4">
            <button
              onClick={() => handleTabChange('favorites')}
              className={`text-sm font-bold w-1/2 transition-opacity ${selectedTab === 'favorites' ? 'opacity-100' : 'opacity-50'}`}
            >
              Cafeterías Favoritas
            </button>
            <button
              onClick={() => handleTabChange('recent')}
              className={`text-sm font-bold w-1/2 transition-opacity ${selectedTab === 'recent' ? 'opacity-100' : 'opacity-50'}`}
            >
              Recientes
            </button>
          </div>
          <hr className="w-4/5 h-[2px] bg-c1 border-none my-4 bg-opacity-40" />

          <div className="w-full p-4 mt-4 rounded sm:w-1/4">
            {selectedTab === 'favorites' ? (
              favoriteCafes.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {favoriteCafes.map(cafe => (
                    <MiniCard key={cafe.id} cafe={cafe} />
                  ))}
                </div>
              ) : (
                <p className="text-center">No tienes cafeterías favoritas.</p>
              )
            ) : (
              <p className="text-center">No tienes cafeterías recientes.</p>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleLogin} className="w-4/5 p-4 mt-4 rounded shadow-md sm:w-1/4 bg-zinc-100">
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
          <button
            type="submit"
            className="w-full p-2 mb-2 text-white transition-all duration-100 bg-blue-500 rounded hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={handleGoRegister}
            className="w-full p-2 mb-4 text-black transition-all duration-100 rounded bg-zinc-200 hover:bg-zinc-400"
          >
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
        <div className="flex flex-col items-center justify-center w-full p-4">
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
