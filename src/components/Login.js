import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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


const starRating = (rating) => {
  const stars = [];
  const totalStars = 5;
  
  const fullStarsCount = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStarsCount = totalStars - fullStarsCount - (hasHalfStar ? 1 : 0);
  
  for (let i = 0; i < fullStarsCount; i++) {
    stars.push(<img key={`full-${i}`} src={fullStarDark} alt="Full Star" className="inline-block w-4 h-4" />);
  }
  
  if (hasHalfStar) {
    stars.push(<img key="half" src={halfStarDark} alt="Half Star" className="inline-block w-4 h-4" />);
  }
  
  for (let i = 0; i < emptyStarsCount; i++) {
    stars.push(<img key={`empty-${i}`} src={emptyStarDark} alt="Empty Star" className="inline-block w-4 h-4" />);
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
  
  const navigate = useNavigate();
  const { cafes = [] } = useContext(CafeContext); // Asegúrate de obtener el contexto correctamente

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        setLoginMessage('Logueado correctamente');
        await fetchUserData(user.uid);
        fetchFavoriteCafes(user.uid);
        fetchUserReviews(user.uid);
      } else {
        setLoggedIn(false);
        setLoginMessage('');
        setFavoriteCafes([]);
        setUserData(null);
        setUserReviews([]);
      }
    });
  
    return () => unsubscribe();
  }, []);

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

  const fetchUserReviews = async () => {
    const reviewsByUser = [];
    
    cafes.forEach(cafe => {
      if (cafe.reviews && Array.isArray(cafe.reviews)) {
        const userCafeReviews = cafe.reviews.filter(review => review.user === auth.currentUser?.displayName);
        if (userCafeReviews.length > 0) {
          reviewsByUser.push({
            cafeId: cafe.id,
            cafeName: cafe.name,
            picsLinks: cafe.picsLinks,  // Asegúrate de agregar esta línea para pasar las imágenes
            reviews: userCafeReviews,
          });
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
    <div className="flex flex-col items-center justify-center">
      <Top text={"Perfil"} />
          <div className="w-4/5 p-4 mt-12 rounded sm:w-1/4">
            <div className="w-full flex items-center">
              {auth.currentUser && auth.currentUser.photoURL && (
                <img
                  src={auth.currentUser.photoURL}
                  alt="Foto de perfil"
                  className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2"
                />
              )}

              <div className="ml-4 flex flex-col gap-1">
                <h2 className="text-lg font-bold text-c2">{userData?.fullName || ''}</h2>
                <h2 className="text-sm font-thin text-c2">{auth.currentUser?.displayName || ''}</h2>
                <h2 className="text-sm font-thin text-c2">
                  {userData?.mainNeighborhood || ''}, <strong className="font-bold italic">CABA</strong>
                </h2>
                <button
                  onClick={handleLogout}
                  className="w-full p-1 mb-2 text-white transition-all duration-100 bg-red-500 rounded hover:bg-red-600 text-[8px]"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Insignias */}
            <div className="flex gap-4 w-full items-center justify-center">
              {userData?.showPet && <img className="w-12 h-12 mt-6" src={petIcon} alt="Pet Friendly" />}
              {userData?.showTac && <img className="w-12 h-12 mt-6" src={tacIcon} alt="Tac" />}
              {userData?.showVegan && <img className="w-12 h-12 mt-6" src={veganIcon} alt="Vegano" />}
            </div>

            {/* Descripción o estado */}
            {userData?.description && (
              <p className="text-c2 text-sm text-center mt-4 font-semibold">
                {userData.description}
              </p>
            )}
          </div>
          
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

          <hr className="w-4/5 h-[2px] bg-c1 border-none my-4 bg-opacity-40" />
<div className="w-full p-4 mt-2 rounded sm:w-1/4 mb-44">
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
  ) : selectedTab === 'recents' ? (
    userReviews.length > 0 ? (
      <div className="p-2 py-0 mb-4 rounded text-c">
        {userReviews.map(cafe => (
          <div key={cafe.cafeId} className="mb-4">
            <h4 className="font-bold mb-2">{cafe.cafeName}</h4>

            
            
            {cafe.reviews.map((review, index) => (
              <div key={index} className="w-full p-2 mb-4 rounded-xl shadow-md bg-b1 bg-opacity-75 text-c flex flex-row ring-1 ring-c">
                <MiniCard cafe={{ id: cafe.cafeId, name: cafe.cafeName, picsLinks: cafe.picsLinks }} />
                <div>
                  <div className="flex items-center mb-2 flex-col p-1">
                    <span className="mr-2 font-bold text-c2 text-left w-full ml-2">{review.user}</span>
                    <div className='flex gap-2'>
                    <span>{starRating(review.rating)}</span>
                    <span className='text-c2 text-opacity-70 text-lg'>{review.date}</span>
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
      <p className="text-center">No tienes reseñas recientes.</p>
    )
  ) : null}
</div>

    </div>
  );
};

export default Login;
