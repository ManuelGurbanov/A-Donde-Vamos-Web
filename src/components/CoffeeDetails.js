import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import outsideIcon from '../img/outside.png';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import { AuthContext } from '../contexts/AuthContext'; // Asegúrate de que la ruta sea correcta


import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { CafeContext } from './CafeContext';

import fav from '../img/fav.webp';

import fullStarDark from '../img/fullStar.png';
import halfStarDark from '../img/halfStar.png';
import emptyStarDark from '../img/emptyStar.png';

import location from '../img/location.png';
import heartadd from '../img/heart-add.png';
import clock from '../img/clock.png';
import additem from '../img/additem.png';
import addsquare from '../img/add-square.png';

import StarRating from './StarRating';
import TopDetails from './TopDetails';

import Slider from 'react-slick';
import { useOutletContext } from 'react-router-dom';

import instagram from '../img/instagram.png';
import menu from '../img/menu.png';
import web from '../img/web.png';
import share from '../img/share.png';
import arrowdown from '../img/arrow_down.png';

const CoffeeDetails = () => {
  const { handleReviewClick } = useOutletContext();
  const { id } = useParams();
  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [textColor, setTextColor] = useState('text-red-500');
  const [showSchedule, setShowSchedule] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const navigate = useNavigate();
  const { setSelectedCafe } = useContext(CafeContext);

  const { currentUser, favorites } = useContext(AuthContext);

  const handleGoMenu = () => {
    // ir al link de menu que está en la base de datos de la cafetería

    window.open(coffee.menuLink, '_blank');
  };

  const handleGoIg = () => {
    window.open(`https://www.instagram.com/${coffee.instagram}/`, '_blank');
  };
  
  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        const docRef = doc(db, 'cafeterias', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCoffee(data);
          setReviews(data.reviews || []);
          setTotalRatings(data.totalRatings || 0);
          setNumRatings(data.numRatings || 0);
  
          if (currentUser) {
            const userHasRated = data.reviews?.some(review => review.userId === currentUser.uid);
            setHasRated(userHasRated);
  
            // Cargar datos del usuario actual
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              console.log('User Data:', userData); // Ver datos del usuario
  
              // Establecer estado de isFavorite
              const userFavorites = userData.favorites || [];
              console.log('User Favorites:', userFavorites); // Verificar la lista de favoritos
              setIsFavorite(userFavorites.includes(id)); // Verificar si la cafetería está en favoritos
            } else {
              console.log('No such user document!');
            }
          }
  
          checkIfOpen(data);
        } else {
          console.log('No such coffee document!');
        }
      } catch (err) {
        console.error('Error fetching coffee details:', err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCoffee();
  }, [id, currentUser]);
  

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.email);
        const userDoc = await getDoc(userRef);
        const data = userDoc.data();
        const favorites = data?.favorites || [];
        setIsFavorite(favorites.includes(id));
        console.log('isFavorite:', isFavorite);
        console.log('Current User:', currentUser);
      }
    };

    checkFavoriteStatus();
  }, [currentUser, id]);

  // Función para agregar una cafetería favorita
  const addFavorite = async (userId, coffeeId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      const favorites = data?.favorites || [];
      
      if (!favorites.includes(coffeeId)) {
        favorites.push(coffeeId);
        await updateDoc(userRef, { favorites });
        console.log('Cafetería favorita agregada');
      }
    } catch (e) {
      console.error('Error al agregar la cafetería favorita: ', e);
    }
  };

  // Función para eliminar una cafetería favorita
  const removeFavorite = async (userId, coffeeId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      const favorites = data?.favorites || [];
      
      const updatedFavorites = favorites.filter(id => id !== coffeeId);
      await updateDoc(userRef, { favorites: updatedFavorites });
      console.log('Cafetería favorita eliminada');
    } catch (e) {
      console.error('Error al eliminar la cafetería favorita: ', e);
    }
  };

  const handleFavoriteClick = async () => {
    if (!currentUser) return;

    if (isFavorite) {
      await removeFavorite(currentUser.uid, id);
    } else {
      await addFavorite(currentUser.uid, id);
    }
    setIsFavorite(!isFavorite);
  };
  
  const checkIfOpen = (data) => {
    const now = new Date();
    const today = now.getDay();  // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  
    // Convertir los "francos" (días libres) en un array de números
    const francos = data.francos ? data.francos.split(',').map(Number) : [];
  
    // Función para obtener el próximo día que no sea franco
    const getNextOpen = () => {
      for (let i = 1; i <= 7; i++) {
        const nextDay = (today + i) % 7; // Ajuste para el próximo día, usando % 7 para ciclos semanales
        
        // Si el día no es franco, devolvemos ese día
        if (!francos.includes(nextDay)) {
          return nextDay;
        }
      }
  
      return null; // En caso de que todos los días sean francos
    };
  
    // Verificar si hoy es un día franco
    if (francos.includes(today)) {
      // Buscar el próximo día que no sea franco
      const nextOpenDay = getNextOpen();
      if (nextOpenDay !== null) {
        const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        setStatus(`Cerrado - Abre el ${daysOfWeek[nextOpenDay]}`);
      } else {
        setStatus('Cerrado indefinidamente');
      }
      setTextColor('text-red-500');
      setIsOpen(false);
    } else {
      // Si hoy no es franco, está abierto
      setStatus('Abierto');
      setTextColor('text-green-500');
      setIsOpen(true);
    }
  };
  
  const handleImageError = (index) => {
    setCoffee(prevState => ({
      ...prevState,
      picsLinks: prevState.picsLinks.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteReview = async (index) => {
    const updatedReviews = [...reviews];
    const deletedReview = updatedReviews.splice(index, 1)[0];
    const updatedTotalRatings = totalRatings - deletedReview.rating;
    const updatedNumRatings = numRatings - 1;
  
    try {
      const docRef = doc(db, 'cafeterias', id);
      await updateDoc(docRef, {
        reviews: updatedReviews,
        totalRatings: updatedTotalRatings,
        numRatings: updatedNumRatings
      });
      setReviews(updatedReviews);
      setTotalRatings(updatedTotalRatings);
      setNumRatings(updatedNumRatings);
      setHasRated(false);
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || hasRated) return;

    const newReview = {
      userId: currentUser.uid,
      user: currentUser.displayName || 'Anonymous',
      rating,
      text: review,
      likes: 0,
      dislikes: 0,
      votes: {}
    };

    const updatedReviews = review.trim() === '' ? reviews : [...reviews, newReview];
    const updatedTotalRatings = totalRatings + rating;
    const updatedNumRatings = numRatings + 1;

    try {
      const docRef = doc(db, 'cafeterias', id);
      await updateDoc(docRef, { 
        reviews: updatedReviews, 
        totalRatings: updatedTotalRatings, 
        numRatings: updatedNumRatings 
      });
      setReviews(updatedReviews);
      setTotalRatings(updatedTotalRatings);
      setNumRatings(updatedNumRatings);
      setReview('');
      setRating(0);
      setHasRated(true);
    } catch (err) {
      console.error('Error updating reviews:', err);
    }
  };

  const handleVote = async (index, type) => {
    if (!currentUser) return;
    
    const updatedReviews = [...reviews];
    const userId = currentUser.uid;

    if (type === 'like') {
      if (updatedReviews[index].votes[userId] === 'like') {
        updatedReviews[index].likes -= 1;
        delete updatedReviews[index].votes[userId];
      } else {
        if (updatedReviews[index].votes[userId] === 'dislike') {
          updatedReviews[index].dislikes -= 1;
        }
        updatedReviews[index].likes += 1;
        updatedReviews[index].votes[userId] = 'like';
      }
    } else if (type === 'dislike') {
      if (updatedReviews[index].votes[userId] === 'dislike') {
        updatedReviews[index].dislikes -= 1;
        delete updatedReviews[index].votes[userId];
      } else {
        if (updatedReviews[index].votes[userId] === 'like') {
          updatedReviews[index].likes -= 1;
        }
        updatedReviews[index].dislikes += 1;
        updatedReviews[index].votes[userId] = 'dislike';
      }
    }

    try {
      const docRef = doc(db, 'cafeterias', id);
      await updateDoc(docRef, { reviews: updatedReviews });
      setReviews(updatedReviews);
    } catch (err) {
      console.error('Error updating votes:', err);
    }
  };

  const starRating = (rating) => {
    const stars = [];
    const totalStars = 5;
    
    const fullStarsCount = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStarsCount = totalStars - fullStarsCount - (hasHalfStar ? 1 : 0);
    
    for (let i = 0; i < fullStarsCount; i++) {
      stars.push(<img key={`full-${i}`} src={fullStarDark} alt="Full Star" className="inline-block w-6 h-6" />);
    }
    
    if (hasHalfStar) {
      stars.push(<img key="half" src={halfStarDark} alt="Half Star" className="inline-block w-6 h-6" />);
    }
    
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<img key={`empty-${i}`} src={emptyStarDark} alt="Empty Star" className="inline-block w-6 h-6" />);
    }
    
    return stars;
  };
  
  const calculateAverageRating = () => {
    if (numRatings === 0) return 0;
    return (totalRatings / numRatings).toFixed(1);
  };

  const handleShareWhatsApp = () => {
    if (navigator.share) {
      navigator.share({
        title: `¿Conoces ${coffee.name}?`,
        text: `Echa un vistazo a este café: ${coffee.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Contenido compartido con éxito.'))
      .catch((error) => console.error('Error al compartir:', error));
    } else {
      // Fallback para navegadores que no soportan la Web Share API
      const whatsappUrl = `https://wa.me/?text=¿Conoces ${coffee.name}?: ${window.location.href}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('¡Enlace copiado al portapapeles!');
  };

  if (loading) {
    return <div className="mt-24 text-3xl text-center text-white">Cargando...</div>;
  }

  
  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
  };

  
  const handleScheduleToggle = () => {
    setShowSchedule(!showSchedule); // Alterna el menú de horarios
  };
  
  const formatTime = (timeString) => {
    if (!timeString || timeString.length !== 4) return timeString;
    return `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
  };
  
  // Función para verificar si el día está en los francos
  const isClosedDay = (day) => {
    const closedDays = coffee.francos?.split(',').map(Number);
    return closedDays?.includes(day);
  };
  
  // Diccionario para los nombres de los días
  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return (
    <div className='flex flex-col items-center justify-center w-screen'>
    <div className="w-screen text-c2 sm:w-1/2">
      {coffee ? (
        <>
        <div className=''>
              <div className="w-full overflow-x-auto rounded-lg sm:h-80 p-0">
        <Slider {...sliderSettings}>
          {coffee.picsLinks?.map((picLink, index) => (
            <div key={index} className="relative w-screen h-64 sm:h-72">
              <img
                src={picLink}
                alt={`Imagen ${index + 1}`}
                className="object-cover h-full w-full rounded-lg"
                onError={() => handleImageError(index)}
              />
              {/* Gradiente */}
              <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-transparent to-transparent rounded-b-lg" />
            </div>
          ))}
        </Slider>
      </div>

          
          <div className='px-4 py-1'>


          <h1 className="mt-0 text-3xl font-bold text-left">{coffee.name}</h1>
          
          <p className="mb-2 text-xl">
            {starRating(calculateAverageRating())}
            {numRatings === 1 ? `${numRatings} valoración` : `${numRatings} valoraciones`}
          </p>
          
            <p className='mb-8 text-xl'>
              <span className={`${textColor}`}> {status}</span>
            </p>

                

            { (coffee.pets || coffee.vegan || coffee.tac || coffee.outside) && (
                            <div className="flex items-center gap-4 mt-2 mb-6">
                            {coffee.pets && (
                              <img src={petIcon} alt="Pet Friendly" className="w-12 h-12 mr-2" />
                            )}
                            {coffee.vegan && (
                              <img src={veganIcon} alt="Vegan Options" className="w-12 h-12 mr-2" />
                            )}
                            {coffee.tac && (
                              <img src={tacIcon} alt="TAC Accepted" className="w-12 h-12 mr-2" />
                            )}
                            {coffee.outside && (
                              <img src={outsideIcon} alt="Outdoor Seating" className="w-12 h-12 mr-2" />
                            )}
                          </div>
              )}

            <div className='flex items-center justify-center gap-4 mb-2 text-center'>
                  <button className='flex flex-row w-1/3 gap-2 p-2 rounded-2xl bg-b1 h-10' onClick={handleGoMenu}>
                    <img src={menu} className='mr-2'></img> <p className='font-medium text-c'>Menú</p>
                  </button>
                  <button className='w-1/6 h-10 p-2 rounded-2xl bg-b1' onClick={handleGoIg}>
                    <img src={instagram} className='m-auto'></img>
                  </button>
                  
                  <button className='w-1/6 h-12 p-2 rounded-2xl bg-b1 h-10' onClick={handleShareWhatsApp}>
                    <img src={share} className='m-auto'></img>
                  </button>

                  <button
                    className={`w-1/6 h-10 p-2 rounded-2xl flex items-center justify-center bg-b1`}
                    onClick={handleFavoriteClick}
                  >
                    <img src={isFavorite ? fav : fav} className={isFavorite ? 'opacity-100' : 'opacity-30'} alt="Favorite Icon" />
                  </button>
            </div>

          <div className='flex flex-row items-center gap-1 mb-2'>
          <img src={location} className='w-4 h-4 mt-2'></img>
          <p className="text-lg ml-1`">{coffee.adress} - {coffee.neigh} </p>
          </div>

          {/* <div className='flex items-center justify-center w-screen'>
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13135.94265913935!2d-58.4441481!3d-34.604524!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccbb8f1e5feb5%3A0xee9eec4bc47799ae!2sBoiro%20caf%C3%A9!5e0!3m2!1sen!2sar!4v1729195502811!5m2!1sen!2sar" width="320" height="200" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div> */}

          <div className='flex flex-row items-center gap-1 mb-2'>
            <img src={clock} className='w-4 h-4 mt-2'></img>
            <p className={`text-xl`}>
              <span className={`${textColor} ml-1`}>{status}</span>
            </p>

            {/* Agrega el botón para abrir el menú de horarios */}
            <button 
              onClick={handleScheduleToggle}
              className='mt-2 ml-2 text-xs bg-transparent rounded-md text-c2'
            >
              <img src={arrowdown} className='w-full m-auto'></img>
            </button>
          </div>

              {/* Menú desplegable de horarios */}
              {showSchedule && (
              <div className="w-full p-4 mt-2 mb-4 bg-white border rounded-lg shadow-lg">
                <h3 className="mb-2 text-lg font-bold">Horarios</h3>

                {/* Lunes a Viernes */}
                <div className="mb-4">
                  {[1, 2, 3, 4, 5].map((day) => (
                    <div key={day} className="mb-2">
                      <p className="font-semibold">{daysOfWeek[day]}</p>
                      {isClosedDay(day) ? (
                        <p className="text-red-600">Cerrado</p>
                      ) : (
                        <>
                          <p>{formatTime(coffee.schedules.lunes_viernes.apertura)} - {formatTime(coffee.schedules.lunes_viernes.cierre)}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>


                {/* Sábado */}
                <div className="mb-4">
                  <h4 className="font-semibold text-md">Sábado</h4>
                  {isClosedDay(6) ? (
                    <p className="text-red-600">CERRADO</p>
                  ) : (
                    <>
                      <p>{formatTime(coffee.schedules.sabado.apertura)} - {formatTime(coffee.schedules.sabado.cierre)}</p>
                    </>
                  )}
                </div>

                  {/* Domingo */}
                  <div className="mb-4">
                  <h4 className="font-semibold text-md">Domingo</h4>
                  {isClosedDay(0) ? (
                    <p className="text-red-600">CERRADO</p>
                  ) : (
                    <>
                      <p>{formatTime(coffee.schedules.domingo.apertura)} - {formatTime(coffee.schedules.sabado.cierre)}</p>
                    </>
                  )}
                </div>
              </div>
            )}

          {/* <div className="w-full max-w-lg">
            <iframe
              src={coffee.googleLink}
              width="100%" height="450" allowFullScreen="" loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-64"
            ></iframe>
          </div> */}

          
          <div className='flex flex-row items-center gap-1 mb-2'>
          <img src={heartadd} className='w-4 h-4 mt-2'></img>
          <p className="ml-1 text-lg">¿Qué te pareció {coffee.name}?</p>
          </div>

          <div className='flex flex-col items-center justify-start w-full mt-4'>
            {/* <button onClick={handleCopyLink} className="px-4 py-2 mb-2 text-white bg-blue-600 rounded">
              Copiar Enlace
            </button> */}

            {/* <button onClick={handleCopyLink} className="flex items-center justify-center w-4/5 gap-2 px-4 py-2 mb-2 font-medium sm:w-1/2 text-c bg-b1 rounded-2xl">
              <img src={additem} className='flex-[1]'></img>
              <p className='text-center text-lg flex-[9]'>
              Compartir
              </p>
            </button> */}

            
            <button onClick={handleReviewClick} className="flex items-center justify-center w-4/5 gap-2 px-4 py-2 mb-2 font-medium sm:w-1/2 text-c bg-b1 rounded-2xl">
              <img src={addsquare} className='flex-[1]'></img>
              <p className='text-center text-lg flex-[9]'>
              Agregar una reseña
              </p>
            </button>

          </div>
          </div>
        </div>


        <div className="p-4 mt-4 mb-24 rounded shadow-md bg-b1 text-c">
          <h2 className="mb-4 text-2xl font-bold">Reseñas</h2>
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="w-full p-4 mb-4 rounded shadow-md bg-b1 text-c">
                <div className="flex items-center mb-2">
                  <span className="mr-2 font-bold">{review.user}</span>
                  <span>{starRating(review.rating)}</span>
                </div>
                <p className="mb-2">{review.text}</p>
                <div className="flex items-center">
                  <button
                    onClick={() => handleVote(index, 'like')}
                    className={`mr-2 ${review.votes[currentUser?.uid] === 'like' ? 'text-blue-600' : 'text-gray-600'}`}
                  >
                    👍 {review.likes}
                  </button>
                  <button
                    onClick={() => handleVote(index, 'dislike')}
                    className={`mr-2 ${review.votes[currentUser?.uid] === 'dislike' ? 'text-red-600' : 'text-gray-600'}`}
                  >
                    👎 {review.dislikes}
                  </button>
                  {currentUser?.uid === review.userId && (
                    <button
                      onClick={() => handleDeleteReview(index)}
                      className="text-red-600"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="mb-4 text-xl text-center text-c">No hay reseñas aún.</p>
          )}
        </div>
        </>
      ) : (
        <p className="p-4 text-c">No se encontraron detalles de la cafetería.</p>
      )}
      </div>
    </div>
  );
};

export default CoffeeDetails;
