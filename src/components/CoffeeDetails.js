import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import outsideIcon from '../img/outside.webp';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import { AuthContext } from '../contexts/AuthContext'; // Asegúrate de que la ruta sea correcta

import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { CafeContext } from './CafeContext';

import fav from '../img/fav.webp';

import maps from '../img/maps.webp';

import fullStarDark from '../img/fullStar.png';
import halfStarDark from '../img/halfStar.png';
import emptyStarDark from '../img/emptyStar.png';

import location from '../img/location.png';
import heartadd from '../img/heart-add.png';
import clock from '../img/clock.png';
import addsquare from '../img/add-square.png';


import Slider from 'react-slick';
import { useOutletContext } from 'react-router-dom';

import instagramimg from '../img/instagram.png';
import menu from '../img/menu.png';
import share from '../img/share.webp';
import arrowdown from '../img/arrow_down.png';
import {Link} from 'react-router-dom';

import Review from './Review';
import PriceRatingBar from './PriceRatingBar';
const CoffeeDetails = () => {
  const { slug } = useParams();
  const [showReview, setShowReview] = useState(false);
  const handleReviewClick = (cafe) => {
    setSelectedCafe(cafe);
    setShowReview((prevShowReview) => !prevShowReview);
  };
  const handleCloseReview = () => {
    setShowReview(false);
  };
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
  const [address, setAddress] = useState('');
  const [coworking, setCoworking] = useState(false);
  const [description, setDescription] = useState('');
  const [googleLink, setGoogleLink] = useState('');
  const [instagram, setInstagram] = useState('');
  const [menuLink, setMenuLink] = useState('');
  const [neigh, setNeigh] = useState('');
  const [outside, setOutside] = useState(false);
  const [patio, setPatio] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [tac, setTac] = useState(false);
  const [takeaway, setTakeaway] = useState(false);
  const [terraza, setTerraza] = useState(false);
  const [vegan, setVegan] = useState(false);
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const { currentUser, favorites } = useContext(AuthContext);

  const { setSelectedCafe } = useContext(CafeContext);

  const [statusMessage, setStatusMessage] = useState('');
  const handleGoMenu = () => {
    window.open(coffee.menuLink, '_blank');
  };

  const handleGoIg = () => {
    window.open(`https://www.instagram.com/${coffee.instagram}/`, '_blank');
  };

  const handleGoMaps = () => {
    window.open(coffee.googleLink, '_blank');
  };



 useEffect(() => {
  const fetchCoffeeBySlug = async () => {
    const coffeeQuery = query(
      collection(db, 'cafeterias'),
      where('slugName', '==', slug)
    );
    const querySnapshot = await getDocs(coffeeQuery);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      setCoffee(data);
      setReviews(data.reviews || []);
    }
  };
  fetchCoffeeBySlug();

  console.log(coffee);
}, [slug]);

useEffect(() => {
  let isMounted = true;

  const fetchCoffeeByName = async () => {
    try {
      const coffeeQuery = query(collection(db, 'cafeterias'), where('slugName', '==', name)); // Revisa que name se define correctamente
      const querySnapshot = await getDocs(coffeeQuery);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();

        if (isMounted) {
          const coffeeWithId = { ...data, id: docSnap.id };
          console.log("COFFEE WITH ID:" + coffeeWithId);

          setCoffee(coffeeWithId);
          setReviews(data.reviews || []);
          setTotalRatings(data.totalRatings || 0);
          setNumRatings(data.numRatings || 0);

        }

        if (currentUser) {
          const userHasRated = data.reviews?.some(review => review.userId === currentUser.uid);
          setHasRated(userHasRated);
          
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (isMounted) {
              const userFavorites = userData.favorites || [];
              setIsFavorite(userFavorites.includes(docSnap.id));
            }
          } else {
            console.log('No such user document!');
          }
        }

        checkIfOpen(data);
      } else {
        console.log('No such coffee document with that name!');
      }
    } catch (err) {
      console.error('Error fetching coffee details by name:', err);
    } finally {
      if (isMounted) setLoading(false);
      console.log("LAS REVIEWS SON: ", reviews);
    }
  };

  fetchCoffeeByName();

  return () => {
    isMounted = false;
  };
}, [name, currentUser]);

  

  

  const addFavorite = async (userId, coffeeId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      const favorites = data?.favorites || [];
      
      if (!favorites.includes(coffee.slugName)) {
        favorites.push(coffee.slugName);
        await updateDoc(userRef, { favorites });
        console.log('Cafetería favorita agregada');
      }
    } catch (e) {
      console.error('Error al agregar la cafetería favorita: ', e);
    }
  };

  const removeFavorite = async (userId, coffeeId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      const data = userDoc.data();
      const favorites = data?.favorites || [];
      
      const updatedFavorites = favorites.filter(id => id !== coffee.slugName);
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
  
  const handleImageError = (index) => {
    setCoffee(prevState => ({
      ...prevState,
      picsLinks: prevState.picsLinks.filter((_, i) => i !== index)
    }));
  };

  const handleDeleteReview = async (index) => {
    const updatedReviews = [...reviews];
    const deletedReview = updatedReviews.splice(index, 1)[0]
    const updatedTotalRatings = totalRatings - deletedReview.rating;
    const updatedNumRatings = numRatings - 1;
  
    try {
      const coffeeQuery = query(
        collection(db, 'cafeterias'),
        where('slugName', '==', coffee.slugName)
      );
      const querySnapshot = await getDocs(coffeeQuery);
  
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, 'cafeterias', docSnap.id);
        await updateDoc(docRef, {
          reviews: updatedReviews,
          totalRatings: updatedTotalRatings,
          numRatings: updatedNumRatings
        });

        setReviews(updatedReviews);
        setTotalRatings(updatedTotalRatings);
        setNumRatings(updatedNumRatings);
        setHasRated(false);
      } else {
        console.log('No se encontró la cafetería');
      }
    } catch (err) {
      console.error('Error al eliminar la reseña:', err);
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
        if (updatedReviews[index].votes[userId] === 'dislike' && updatedReviews[index].dislikes > 0) {
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
      const coffeeQuery = query(
        collection(db, 'cafeterias'),
        where('slugName', '==', slug)
      );
      const querySnapshot = await getDocs(coffeeQuery);
  
      if (!querySnapshot.empty) {
        const cafeDoc = querySnapshot.docs[0];
        const cafeRef = doc(db, 'cafeterias', cafeDoc.id);
        await updateDoc(cafeRef, { reviews: updatedReviews });
        setReviews(updatedReviews);
      }
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
    setShowSchedule(!showSchedule);
  };
  
  const formatTime = (timeString) => {
    if (!timeString || timeString.length !== 4) return timeString;
    return `${timeString.slice(0, 2)}:${timeString.slice(2)}`;
  };
  
  const isClosedDay = (day) => {
    const closedDays = coffee.francos?.split(',').map(Number);
    return closedDays?.includes(day);
  };
  
  // Diccionario para los nombres de los días
  const daysOfWeek = ['domingo', 'lunes', 'martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];


  const checkIfOpen = (schedules) => {
    const currentDate = new Date(); // Obtener la fecha y hora actual
    const currentDay = currentDate.getDay(); // Día actual (0 = Domingo, ..., 6 = Sábado)
    const currentTimeInMinutes = currentDate.getHours() * 60 + currentDate.getMinutes(); // Hora actual en minutos
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']; // Mapeo de días
    const currentDayName = dayNames[currentDay];
    const previousDayName = dayNames[(currentDay - 1 + 7) % 7]; // Día anterior, ajustado para la rotación semanal
    
    // Obtener el horario del día actual y del día anterior
    const todaySchedule = schedules[currentDayName];
    const previousDaySchedule = schedules[previousDayName];

    // Paso 1: Verificar si el día anterior tenía un horario extendido (cierre después de medianoche)
    if (previousDaySchedule && !previousDaySchedule.cerrado) {
        const previousDayOpeningTime = parseTime(previousDaySchedule.apertura); // Apertura del día anterior en minutos
        let previousDayClosingTime = parseTime(previousDaySchedule.cierre); // Cierre del día anterior en minutos

        // Si el cierre es después de medianoche, ajustar a un valor mayor que 1440
        if (previousDayClosingTime < previousDayOpeningTime) {
            previousDayClosingTime += 1440; // Se extiende al siguiente día
        }

        // Calcular el tiempo que ha pasado desde el inicio del día anterior
        const minutesSincePreviousDayStart = 1440 + currentTimeInMinutes;
        if (minutesSincePreviousDayStart < previousDayClosingTime) {
            return 'Abierto';
        }
    }

    // Paso 2: Si no estamos en el horario extendido, verificar el horario del día actual
    if (!todaySchedule || todaySchedule.cerrado) {
     //   console.log("CERRADO (según horario de hoy)");
        return 'Cerrado';
    }

    const openingTime = parseTime(todaySchedule.apertura); // Apertura de hoy en minutos
    let closingTime = parseTime(todaySchedule.cierre); // Cierre de hoy en minutos

    // Si el cierre es después de medianoche, ajustar el tiempo de cierre
    if (closingTime < openingTime) {
        closingTime += 1440; // Ajustar a minutos del día siguiente
    }

   // console.log(`Día actual (${currentDayName}): apertura a ${openingTime} min, cierre a ${closingTime} min`);

    // Verificar si la hora actual está dentro del rango de apertura de hoy
    if (currentTimeInMinutes >= openingTime && currentTimeInMinutes < closingTime) {
        //console.log("ABIERTO (según horario de hoy)");
        return 'Abierto';
    }

    //console.log("CERRADO (fuera del horario de hoy)");
    return 'Cerrado';
};


// Función para convertir la hora en formato "HHMM" a minutos
const parseTime = (timeString) => {
    const hours = parseInt(timeString.slice(0, 2), 10);
    const minutes = parseInt(timeString.slice(2, 4), 10);
    return hours * 60 + minutes; // Devuelve el total en minutos
};

  

  const getCurrentDayName = () => {
    const daysOfWeek = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // Devuelve un número entre 0 (domingo) y 6 (sábado)
    return daysOfWeek[currentDay];
  };
  
  // Función para obtener la hora actual en formato HH:MM
  const getCurrentTime = () => {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0'); // Asegura que tenga dos dígitos
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const adminEmails = ["manuelgurbanov@gmail.com", "nahuferrnandezz@gmail.com"];

  const isAdmin = adminEmails.includes(currentUser?.email);



  return (
    <div className='flex flex-col items-center justify-center w-screen'>
            {showReview && (
        <div className="review-popup">
          <Review onClose={handleCloseReview} selectedCafe={coffee} />
        </div>
      )}
    <div className="w-screen text-c2 sm:w-1/2">
      {coffee ? (
        <>
        <div className=''>
              <div className="w-full overflow-x-auto sm:h-80 p-0">
        <Slider {...sliderSettings}>
          {coffee.picsLinks?.map((picLink, index) => (
            <div key={index} className="relative w-screen h-64 sm:h-72">
        <img
          src={picLink}
          alt={`Imagen ${index + 1}`}
          className="object-cover h-full w-full"
          onError={() => handleImageError(index)}
        />  

  <div
    style={{
      position: "absolute",
      bottom: -10,
      left: 0,
      width: "100%",
      height: "30px",
      background: "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)",
    }}
  />

  <div
    style={{
      position: "absolute",
      bottom: -8,
      left: 0,
      width: "100%",
      height: "30px",
      background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)",
    }}
  />
</div>


          ))}
        </Slider>
      </div>

          
          <div className='px-4 py-1'>


          <h1 className="mt-0 text-3xl font-bold text-left">{coffee.name}</h1>
          
          <div className='flex gap-4'>
            <p className="mb-1 text-xl">
              {starRating(calculateAverageRating())}
            </p>
            <p className="mb-1 mt-1 text-xl">
            {numRatings === 1 ? `${numRatings} valoración` : `${numRatings} valoraciones`}
          </p>
          </div>

          
          <p>{statusMessage}</p>
          
          <p className='w-full p-0 text-xl text-left'>{coffee.description || "Café de Especialidad."} </p>

          {isAdmin && (
        <Link to={`/cafe/${coffee.slugName}/editar`}>
          <button className="bg-blue-500 text-white p-2 rounded mt-2 mb-2">Editar</button>
        </Link>
      )}

            { (coffee.pet || coffee.vegan || coffee.tac || coffee.outside) && (
                            <div className="flex items-center gap-4 mt-2 mb-6">
                            {coffee.pet && (
                              <div className='flex flex-col gap-0'>
                                <img src={petIcon} alt="Pet Friendly" className="w-12 h-12 mr-2" />
                                <h1 className='text-center text-xs opacity-0 hover:opacity-50'>Pet Friendly</h1>
                              </div>
                            )}
                            {coffee.vegan && (
                                <div className='flex flex-col gap-0'>
                                  <img src={veganIcon} alt="Vegan" className="w-12 h-12 mr-2" />
                                  <h1 className='text-center text-xs opacity-0 hover:opacity-50'>Opciones Veganas</h1>
                                </div>
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
                  <button className={`flex flex-row justify-between w-1/3 sm:w-1/6 gap-0 p-2 rounded-2xl bg-b1 h-10 ${!coffee.menuLink ? 'opacity-50 cursor-not-allowed bg-red-600' : ''}`} onClick={handleGoMenu} disabled={!coffee.menuLink}>
                    <img src={menu} className='md:ml-1 sm:mr-2'></img> <p className='text-md text-c sm:mr-4 mr-1'>Menú</p>
                  </button>
                  <button className='w-1/6 h-10 p-2 rounded-2xl bg-b1' onClick={handleGoMaps}>
                    <img src={maps} className='m-auto w-7'></img>
                  </button>

                  <button className={`w-1/6 h-10 p-2 rounded-2xl bg-b1 ${!coffee.instagram ? 'opacity-50 cursor-not-allowed bg-red-600' : ''}`} onClick={handleGoIg} disabled={!coffee.instagram}>
                    <img src={instagramimg} className='m-auto'></img>
                  </button>
                  
                  <button className='w-1/6 p-2 rounded-2xl bg-b1 h-10' onClick={handleShareWhatsApp}>
                    <img src={share} className='w-6 m-auto'></img>
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

          <div className='flex flex-row items-center gap-1 mb-2'>
            <img src={clock} className='w-4 h-4 mt-2'></img>
            

            <p className={`text-xl`}>
              <span>{checkIfOpen(coffee.schedules)}</span>
            </p>

            <button 
              onClick={handleScheduleToggle}
              className='mt-2 ml-2 text-xs bg-transparent rounded-md text-c2'
            >
              <img src={arrowdown} className='w-full m-auto'></img>
            </button>
          </div>
{showSchedule && (
  <div className="w-full p-4 mt-2 mb-4 bg-white border rounded-lg shadow-lg">
    <h3 className="mb-2 text-lg font-bold">Horarios</h3>

    {['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'].map((dayName, index) => {
      const customSchedule = coffee.schedules[dayName];
      const isClosed = isClosedDay(index); 

      const dayNameWithTilde = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][index];

      return (
        <div key={dayName} className="mb-2">
          <p className="font-semibold">{dayNameWithTilde}</p>
          {isClosed || (customSchedule?.apertura === "") ? (
            <p className="text-red-600">Cerrado</p>
          ) : (
            <p>
              {formatTime(customSchedule?.apertura || 'Cerrado')} - { 
              formatTime(customSchedule?.cierre || 'Cerrado')}
            </p>
          )}
        </div>
      );
    })}
  </div>
)}


        <div className='flex flex-col items-center gap-1 mb-2'>
        <PriceRatingBar
            slug={coffee.slugName}
            category="el café"
            options={['muy malo', 'malo', 'regular', 'bueno', 'muy bueno']}
            dbField="coffeeRatings"
          />
          <PriceRatingBar
            slug={coffee.slugName}
            category="el precio"
            options={['carísico', 'caro', 'regular', 'bueno', 'barato']}
            dbField="priceRatings"
          />
          <PriceRatingBar
            slug={coffee.slugName}
            category="la pastelería"
            options={['muy mala', 'mala', 'regular', 'buena', 'muy bueno']}
            dbField="bakeryRatings"
          />
          <PriceRatingBar
            slug={coffee.slugName}
            category="el ambiente"
            options={['muy malo', 'malo', 'regular', 'bueno', 'muy bueno']}
            dbField="ambientRatings"
          />
          <PriceRatingBar
            slug={coffee.slugName}
            category="la atención"
            options={['muy mala', 'mala', 'regular', 'buena', 'muy buena']}
            dbield="workersRatings"
          />
        </div>



          <div className='flex flex-row items-center gap-1 mb-2 mt-2'>
          <img src={heartadd} className='w-4 h-4 mt-2'></img>
          <p className="ml-1 text-lg">¿Qué te pareció {coffee.name}?</p>
          </div>

          <div className='flex flex-col items-center justify-start w-full mt-4'>
          <button
              onClick={() => handleReviewClick(coffee)}
              className="flex items-center justify-center w-4/5 gap-2 px-4 py-2 mb-2 font-medium sm:w-1/2 text-c bg-b1 rounded-2xl"
            >
              <img src={addsquare} className="flex-[1]" alt="Add review" />
              <p className="text-center text-lg flex-[9]">
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
      <div key={index} className="w-full p-2 mb-4 rounded-xl shadow-md bg-b1 bg-opacity-75 text-c flex flex-col ring-1 ring-c h-56">
        <div className="flex flex-col w-full h-full justify-between">
          <div className="flex flex-col items-center mb-2 p-1">
          <span 
                  className="mr-2 font-bold text-c2 text-left w-full ml-2 cursor-pointer"
                  onClick={() => navigate(`/profile/${review.userId}`)}
                >
                  {review.user}
                </span>
            <div className="w-full gap-5 items-center flex justify-between">
              <span>{starRating(review.rating)}</span>
              <span className="text-c2 text-opacity-70 text-xl">{review.date}</span>
            </div>
          </div>

          {/* Texto de la reseña */}
          <p className="mb-2 text-c2 px-2 h-full">{review.text}</p>

          {/* Botones de interacción: like, dislike, eliminar */}
          <div className="flex items-center px-2">
            <button
              onClick={() => handleVote(index, 'like')}
              className="mr-2 text-c2"
            >
              👍 {review.likes}
            </button>
            <button
              onClick={() => handleVote(index, 'dislike')}
              className="mr-2 text-c2"
            >
              👎 {review.dislikes}
            </button>
            {currentUser?.uid === review.userId && (
              <button
                onClick={() => handleDeleteReview(index)}
                className="bg-red-600 px-2 py-1 text-white rounded"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No hay reseñas.</p>
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
