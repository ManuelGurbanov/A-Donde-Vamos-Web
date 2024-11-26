import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth, provider, db } from '../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import Top from './Top';
import { CafeContext } from './CafeContext';
import { doc, getDoc } from 'firebase/firestore'; 
import MiniCard from './MiniCard';

import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import fullStarDark from '../img/fullStarRed.webp';
import halfStarDark from '../img/halfStarRed.webp';
import emptyStarDark from '../img/emptyStarRed.webp';
import RatingDistribution from './RatingDistributions';

import screen4 from '../img/screen4-selected.png';
import info from '../img/info.png';
import colaborate from '../img/colaborate.png';
import settings from '../img/settings.png';

import EditProfile from './EditProfile';

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
  const { uid } = useParams(); // Aquí se extrae el uid de la URL
  const { cafes = [] } = useContext(CafeContext);

  useEffect(() => {
    if (!uid) {
      console.error("No se proporcionó uid en la URL.");
      return; // Sal de la función si uid no está presente
    }
    fetchUserData(uid);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);

        if (user.uid !== uid) {
          setState(1);
        }
      } else {
        setLoggedIn(false);
      }
      setLoginMessage('Logueado correctamente');
      await fetchUserData(uid);
      fetchFavoriteCafes(uid);
      fetchUserReviews(uid);
    });
  
    return () => unsubscribe();
  }, [uid]);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userDataFromFirestore = userDoc.data();
        setUserData(userDataFromFirestore);
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
    console.log(cafes);

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
          console.log(reviewsByUser);
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

  return (
    <div className="flex flex-col items-center justify-center mb-6">
          {(state === 0 || state === 1) && (auth.currentUser && auth.currentUser.uid === uid) && (
            <>
            <Top text={"Mi Perfil"} />
            <div className="w-4/5 p-4 mt-12 rounded sm:w-1/4">
            <div className="w-full flex items-center">
              {auth.currentUser && auth.currentUser.uid === uid ? (
                <img
                  src={auth.currentUser.photoURL}
                  alt="Foto de perfil"
                  className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 object-cover"
                />
              ) : (
                userData?.profilePicture && (
                  <img
                  src={userData.profilePicture}
                  alt="Foto de perfil"
                  className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 object-cover"
                />
                )
              )}

              <div className="ml-4 flex flex-col gap-1">
                <h2 className="text-lg font-bold text-c2">{userData?.fullName || ''}</h2>
                <h2 className="text-sm font-thin text-c2">{userData?.username || ''}</h2>
                <h2 className="text-sm font-thin text-c2">
                  {userData?.mainNeighborhood || ''}, <strong className="font-bold italic">CABA</strong>
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

          {state === 1 && (auth.currentUser.uid !== uid) && (
                            userData?.profilePicture) && 
                            <>
                              <Top text={userData.username} />
                              <img
                                src={userData.profilePicture}
                                alt="Foto de perfil"
                                className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 mt-4 object-cover"
                              />
                            </>}
          
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
                        console.log("Cafe es: " + cafe.newName),

                        <div key={index} className="w-full p-2 mb-4 rounded-xl shadow-md bg-b1 bg-opacity-75 text-c flex flex-row ring-1 ring-c">
                          <div className='w-24'>
                          <MiniCard key={cafe.cafeId} cafe={cafe} slug={cafe.cafeId} newName={cafe.newName} />
                          </div>
                          <div>
                            <div className="flex items-center mb-2 flex-col p-1 w-full">
                              <span className="mr-2 font-bold text-c2 text-left w-full ml-4">{review.user}</span>
                              <div className='flex gap-1 justify-between ml-2 w-full'>
                                <span>{starRating(review.rating)}</span>
                                <span className='text-c2 text-opacity-70 text-xl'>{review.date}</span>
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
              <Top text={"Sobre la App"} />
              <div className='flex flex-col gap-3 items-center w-full p-4 sm:w-1/3'>
                <p className='text-c text-sm font-semibold italic sm:text-lg'>Esta app fue creada con el fin de ayudar a los amantes del café a encontrar lugares nuevos para disfrutar de una buena taza de café. Si tenés alguna sugerencia o comentario, no dudes en contactarnos.</p>
              </div>
              </>
            )}

            {state === 3 && (
              <>
              <Top text={"Colaborá"} />
              <div className='flex flex-col gap-3 items-center w-full p-4 sm:w-1/3'>

                <p className='text-c text-sm font-semibold italic sm:text-lg'>Si te gustaría colaborar con nosotros, no dudes en contactarnos. Estamos buscando gente que nos ayude a mejorar la app y a agregar nuevas funcionalidades.</p>
              </div>
              </>
            )}

            {state === 4 && (
              <>
              <Top text={"Ajustes"} />
              <div className='flex flex-col gap-3 items-center w-full p-4 sm:w-1/3'>
                <EditProfile/>
              </div>
              </>
            )}


    </div>
  );
};

export default Login;