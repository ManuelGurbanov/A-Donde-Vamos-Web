import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, provider, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { CafeContext } from './CafeContext';
import { doc, getDoc } from 'firebase/firestore'; 
import MiniCard from './MiniCard';

import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

import petIcon from '../img/pet.webp';
import tacIcon from '../img/sinGluten.webp';
import veganIcon from '../img/vegan.webp';

import fullStarDark from '../img/fullStarRed.webp';
import halfStarDark from '../img/halfStarRed.webp';
import emptyStarDark from '../img/emptyStarRed.webp';
import RatingDistribution from './RatingDistributions';

import screen4 from '../img/screen4-selected.png';
import info from '../img/info.png';
import colaborate from '../img/colaborate.png';
import settings from '../img/settings.png';

import EditProfile from './EditProfile';
import Top from './Top';

import TeamMember from './TeamMember';

import loadingLogo from '../img/loading_logo.png';
import searchLogo from '../img/screen2.png';

import { Link } from 'react-router-dom';

const starRating = (rating) => {
  const stars = [];
  const totalStars = 5;
  
  const fullStarsCount = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStarsCount = totalStars - fullStarsCount - (hasHalfStar ? 1 : 0);
  
  for (let i = 0; i < fullStarsCount; i++) {
    stars.push(<img key={`full-${i}`} src={fullStarDark} alt="Full Star" className="inline-block w-5 h-5" />);
  }
  
  if (hasHalfStar) {
    stars.push(<img key="half" src={halfStarDark} alt="Half Star" className="inline-block w-5 h-5" />);
  }
  
  for (let i = 0; i < emptyStarsCount; i++) {
    stars.push(<img key={`empty-${i}`} src={emptyStarDark} alt="Empty Star" className="inline-block w-5 h-5" />);
  }
  
  return stars;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [favoriteCafes, setFavoriteCafes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [selectedTab, setSelectedTab] = useState('favorites');
  const [userReviews, setUserReviews] = useState([]);

  const [state, setState] = useState(0);
  
  const navigate = useNavigate();
  const { uid } = useParams();
  const { cafes = [] } = useContext(CafeContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!uid) {
      console.warn("No se proporcionó uid en la URL. Usando perfil anónimo.");
      setUserData({
        username: "Anónimo",
        fullName: "Usuario Anónimo",
        profilePicture: "/ruta/a/imagen_default.png",
        mainNeighborhood: "Desconocido",
      });
      return;
    }
  
    fetchUserData(uid);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        if (user.uid !== uid) {
          setState(1);
        }
      } else {
        console.warn("No hay usuario autenticado. Usando perfil anónimo.");
        setLoggedIn(false);
        setUserData({
          username: "Anónimo",
          fullName: "Usuario Anónimo",
          profilePicture: "/ruta/a/imagen_default.png",
          mainNeighborhood: "Desconocido",
        });
        setState(1);
      }
      setLoginMessage('Logueado correctamente');
      await fetchUserData(uid);
      fetchFavoriteCafes(uid);
      fetchUserReviews(uid);
    });
  
    return () => unsubscribe();
  }, [uid]);
  

  const db = getFirestore(); // Inicializa Firestore

  const fetchUsers = async (queryText) => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
  
      const allUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log('Todos los usuarios:', allUsers);

  
      const filtered = allUsers.filter((user) =>
        user.username?.toLowerCase().includes(queryText.toLowerCase())
      );
  
      setFilteredUsers(filtered);
      console.log('Texto de búsqueda:', queryText);
      console.log('Usuarios filtrados:', filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      fetchUsers(searchQuery);
    } else {
      setFilteredUsers([]); 
    }
  }, [searchQuery]);


  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userDataFromFirestore = userDoc.data();
        setUserData(userDataFromFirestore);

        sessionStorage.setItem('userData', JSON.stringify(userDataFromFirestore));
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
  
        const favoriteCafes = cafes.filter(cafe => favoriteIds.includes(cafe.slugName));
        setFavoriteCafes(favoriteCafes);
      } else {
        setFavoriteCafes([]);
      }
    } catch (error) {
      console.error('Error al obtener cafeterías favoritas', error);
      setFavoriteCafes([]);
    }
  };

  const fetchUserReviews = async (uid) => {
    const reviewsByUser = [];
    //console.log(cafes);

    cafes.forEach(cafe => {
      if (cafe.reviews && Array.isArray(cafe.reviews)) {
        const userCafeReviews = cafe.reviews.filter(review => review.userId === uid);
        if (userCafeReviews.length > 0) {
          reviewsByUser.push({
            cafeId: cafe.slugName,
            newName: cafe.name,
            picsLinks: cafe.picsLinks,
            reviews: userCafeReviews,
          });
          //console.log(reviewsByUser);
        }
      }
    });
    
    setUserReviews(reviewsByUser);
  };
  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (user.emailVerified) {
        setLoginMessage('Logueado correctamente');
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userDataFromFirestore = userDoc.data();
          sessionStorage.setItem('userData', JSON.stringify(userDataFromFirestore));
        }
      } else {
        await signOut(auth);
        setLoginMessage('Por favor, verifica tu correo antes de iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      setLoginMessage('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/home');
    } catch (error) {
      console.error('Error al loguear con Google', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoginMessage('Deslogueado correctamente');
      sessionStorage.removeItem('userData');
      navigate('/home');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  const handleGoRegister = () => {
    navigate('/register');
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const savedUserData = JSON.parse(sessionStorage.getItem('userData'));

  function isThisUser() {
    if (!auth.currentUser) {return false;}
    if (auth.currentUser.uid === uid) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <>
    <Top text={savedUserData?.username}/>
    <div className="flex flex-col items-center justify-center mb-6">
    <div className="relative w-full m-auto sm:w-1/2 mb-4 text-center px-4 flex flex-col items-center justify-center">
      <h1 className='text-lg font-bold text-left text-c w-full mt-2'>Buscar Perfil</h1>
        <hr className="w-full h-[2px] bg-c2 border-none bg-opacity-40 m-auto mb-2" />
      <div className="relative w-full px-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Nombre"
          className="w-full p-2 pl-10 text-black rounded-lg placeholder-c bg-zinc-300"
          autoComplete="off"
        />
        <img
          src={searchLogo} 
          alt="icono usuario"
          className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4"
        />
      </div>

      {isLoading ? (
        <div className="w-4/5 sm:w-1/2 m-auto bg-b1 rounded-lg px-6 mb-4 absolute top-24 z-50">
          <p className='p-4'>Cargando resultados...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="w-4/5 sm:w-1/2 m-auto bg-b1 rounded-lg px-6 mb-4 absolute top-24 z-50">
            {filteredUsers.slice(0,3).map((user) => (
              <Link to={`/profile/${user.id}`} className='w-full'>
              <ul className='py-2 ring-2 ring-c rounded-xl mt-4 mb-4 px-5 bg-b1' onClick={() => setSearchQuery(" ")}>
                {user.username}
              </ul>
              </Link>
            ))}
        </div>
      ) : (
        searchQuery.trim() && (
          <div className="w--4/5 sm:w-1/2 text-center absolute top-24 z-50 bg-b1 rounded-lg px-6">
            <p className='p-4'>No se encontraron resultados.</p>
          </div>
        )
      )}
    </div>

      {(state === 0 || state === 1) && (isThisUser) && (
        <>
          <div className="w-4/5 p-4 mt-2 rounded sm:w-1/4">
            <div className="w-full flex items-center">
              {auth.currentUser && auth.currentUser.uid === uid ? (
                <img
                  src={auth.currentUser.photoURL || savedUserData?.profilePicture}
                  alt="Foto de perfil"
                  className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 object-cover"
                />
              ) : (
                savedUserData?.profilePicture && (
                  <img
                    src={savedUserData.profilePicture}
                    alt="Foto de perfil"
                    className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 object-cover"
                  />
                )
              )}

              <div className="ml-4 flex flex-col gap-1">
                <h2 className="text-lg font-bold text-c2">{savedUserData?.fullName || ''}</h2>
                <h2 className="text-sm font-thin text-c2">{savedUserData?.username || ''}</h2>
                <h2 className="text-sm font-thin text-c2">
                  {savedUserData?.mainNeighborhood && (
                    <>
                      {savedUserData.mainNeighborhood}, <span className="font-bold">CABA</span>
                    </>
                  )}
                </h2>



                {auth.currentUser && auth.currentUser.uid === uid && (
                  <button
                    onClick={handleLogout}
                    className="w-full p-1 mb-2 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600 text-[8px] sm:text-base sm:p-2"
                  >
                    Cerrar Sesión
                  </button>
                  )}

                  </div>
            </div>
          </div>
            </>
            )
             }

          {/* {state === 1 && (auth.currentUser.uid !== uid) && (
                            userData?.profilePicture) && 
                            <>
                              <img
                                src={userData.profilePicture}
                                alt="Foto de perfil"
                                className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 mt-4 object-cover"
                              />
                            </>} */}
          
          {state === 1 && (
              <>
                          {/* Insignias */}
            <div className="flex gap-4 w-full items-center justify-center">
              {userData?.showPet && <img className="w-12 h-12 mt-6" src={petIcon} alt="Pet Friendly" />}
              {userData?.showTac && <img className="w-12 h-12 mt-6" src={tacIcon} alt="Tac" />}
              {userData?.showVegan && <img className="w-12 h-12 mt-6" src={veganIcon} alt="Vegano" />}
            </div>

            {/* Descripción o estado */}
            {userData?.description && (
              <p className="text-c2 text-xs text-center mt-4 font-semibold sm:w-1/2 w-2/3 break-words whitespace-pre-wrap">
                {userData.description}
              </p>
            )}

                        <RatingDistribution reviews={userReviews} />
                        {/* Pestañas de favoritos y recientes */}
          <div className="w-4/5 flex text-c mt-4">
            <button
              onClick={() => handleTabChange('favorites')}
              className={`text-sm font-bold w-1/2 transition-opacity ${selectedTab === 'favorites' ? 'opacity-100' : 'opacity-50'}`}
            >
              Cafeterías Favoritas
            </button>
            <button
              onClick={() => handleTabChange('recents')}
              className={`text-sm font-bold w-1/2 transition-opacity ${selectedTab === 'recents' ? 'opacity-100' : 'opacity-50'}`}
            >
              Reseñas
            </button>
          </div>

          <hr className="w-4/5 h-[2px] bg-c2 border-none my-4 bg-opacity-40" />
          <div className="w-full p-4 mt-2 rounded sm:w-1/2 h-auto">
            {selectedTab === 'favorites' ? (
              favoriteCafes.length > 0 ? (
                <div className="grid grid-cols-3 sm:gap-8 gap-y-3 items-center justify-center">
                  {favoriteCafes.map(cafe => (
                    <MiniCard key={cafe.id} cafe={cafe} slug={cafe.slugName} />
                  ))}
                </div>
              ) : (
                <p className="text-center">No tienes cafeterías favoritas.</p>
              )
            ) : selectedTab === 'recents' ? (
              userReviews.length > 0 ? (
                <div className="p-2 py-0 rounded text-c">
                  {userReviews.map(cafe => (
                    <div key={cafe.cafeId} className="mb-4">
                      {cafe.reviews.filter(review => review.text !== '').map((review, index) => (
                        <div key={index} className="w-full p-2 mb-4 rounded-xl shadow-md bg-white bg-opacity-100 text-c flex flex-row ring-1 ring-c">
                          <div className='w-36 mr-1'>
                          <MiniCard key={cafe.cafeId} cafe={cafe} slug={cafe.cafeId} newName={cafe.newName} />
                          </div>
                          <div className='w-full'>
                            <div className="flex items-center mb-2 flex-col p-1 w-full">
                              <span className="mr-2 font-bold text-c2 text-left w-full ml-4">{review.user}</span>
                              <div className='flex gap-1 justify-between ml-2 w-full'>
                                <span>{starRating(review.rating)}</span>
                                <span className='text-c2 text-opacity-70 text-xl mr-5'>{review.date}</span>
                              </div>
                            </div>
                            <p className="mb-2 text-c2 px-2">{review.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No tienes reseñas.</p>
              )
            ) : null}
          </div>
              </>
          )}

          {state === 0 && (
            <div className='flex flex-col gap-3 items-center w-full sm:w-1/4'>
            
            <button className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 font-medium sm:w-1/2 text-c bg-b1 rounded-2xl" onClick={() => setState(1)}>
              <img src={screen4} className='flex-[1] w-6'></img>
              <p className='text-center text-sm flex-[9]'>
              Ver mi Perfil
              </p>
            </button>

            <button className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 font-medium sm:w-1/2 text-c bg-b1 rounded-2xl" onClick={() => setState(2)}>
              <img src={info} className='flex-[1] w-6'></img>
              <p className='text-center text-sm flex-[9]'>
              Sobre la App
              </p>
            </button>

            <button className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 font-medium sm:w-1/2 text-c bg-b1 rounded-2xl" onClick={() => setState(3)}>
              <img src={colaborate} className='flex-[1] w-6'></img>
              <p className='text-center text-sm flex-[9]'>
              Colaborá
              </p>
            </button>

            <button className="flex items-center justify-center w-1/2 gap-2 px-4 py-2 font-medium sm:w-1/2 text-c bg-b1 rounded-2xl" onClick={() => setState(4)}>
              <img src={settings} className='flex-[1] w-6'></img>
              <p className='text-center text-sm flex-[9]'>
              Ajustes
              </p>
            </button>

            </div>
            )}

            {state === 2 && (
              <>
              <div className='flex flex-col gap-3 items-center w-full p-4 sm:w-1/3'>
                <h1 className='text-c2 text-lg font-semibold'>Equipo de <span className='italic text-c font-bold'>¿A Dónde Vamos?</span></h1>
                  <div
                  className='w-full h-full flex flex-col gap-4 items-center justify-center'
                  >
                      <TeamMember name="Manuel Gurbanov" role="Desarrollador" linkedIn={"https://www.linkedin.com/in/manuel-gurbanov-5b6307242/"}/>
                      <TeamMember name="Nahuel Fernandez" role="Administrador de Proyecto" linkedIn={"https://www.linkedin.com/in/nahuel-el%C3%ADas-fern%C3%A1ndez-4a9051255/"}/>
                      <TeamMember name="Helena Trindade" role="Diseño UX/UI"/>

                      <button className='w-1/2 p-2 text-c bg-b1 rounded-2xl' onClick={() => setState(0)}>
                        Volver
                      </button>
                  </div>
              </div>
              </>
            )}

            {state === 3 && (
              <>
              <div className='flex flex-col gap-3 items-center w-full p-4 sm:w-1/3'>

                <p className='text-c text-sm font-semibold italic sm:text-lg'>Si te gustaría colaborar con nosotros, no dudes en contactarnos. Estamos buscando gente que nos ayude a mejorar la app y a agregar nuevas funcionalidades.</p>
                <button className='w-1/2 p-2 text-c bg-b1 rounded-2xl' onClick={() => setState(0)}>
                        Volver
                </button>
              </div>
              </>
            )}

            {state === 4 && (
              <>
              <div className='flex flex-col gap-3 items-center w-full p-4 sm:w-1/3'>
                <EditProfile backFunction={setState}/>
              </div>
              </>
            )}


    </div>
    </>
  );
};

export default Login;