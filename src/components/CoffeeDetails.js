import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import outsideIcon from '../img/outside.png';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { CafeContext } from './CafeContext';

import fav from '../img/fav.png';

import fullStarDark from '../img/fullStar.png';
import halfStarDark from '../img/halfStar.png';
import emptyStarDark from '../img/emptyStar.png';

import location from '../img/location.png';
import heartadd from '../img/heart-add.png';
import clock from '../img/clock.png';
import additem from '../img/additem.png';
import addsquare from '../img/add-square.png';

import StarRating from './StarRating';
import Top from './Top';

import Slider from 'react-slick';

const CoffeeDetails = () => {
  const { id } = useParams();
  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [totalRatings, setTotalRatings] = useState(0);
  const [numRatings, setNumRatings] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [textColor, setTextColor] = useState('text-red-500');

  const [isFavorite, setIsFavorite] = useState(false);

  const navigate = useNavigate();
  const { setSelectedCafe } = useContext(CafeContext);

  
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

            const userDocRef = doc(db, 'usuarios', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userFavorites = userDocSnap.data().favorites || [];
              setIsFavorite(userFavorites.includes(id));
            }
          }

          // Verificar si la cafetería está abierta
          checkIfOpen(data);
        } else {
          console.log('No such document!');
        }
      } catch (err) {
        console.error('Error fetching coffee details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoffee();
  }, [id, currentUser]);

  const handleFavoriteToggle = async () => {
    if (!currentUser) return;
  
    try {
      const userDocRef = doc(db, 'usuarios', currentUser.uid);
  
      if (isFavorite) {
        await updateDoc(userDocRef, {
          favorites: arrayRemove(id)
        });
        setIsFavorite(false);
      } else {
        await updateDoc(userDocRef, {
          favorites: arrayUnion(id)
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
    }
  };
  
  const checkIfOpen = (data) => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 100 + minutes;

    let schedule;
    if (day >= 1 && day <= 5) {
      schedule = data.schedules['lunes-viernes'];
    } else if (day === 6) {
      schedule = data.schedules.sabado;
    } else {
      schedule = data.schedules.domingo;
    }

    if (schedule) {
      const closingTime = schedule.cierre;
      const closingHours = Math.floor(closingTime / 100);
      const closingMinutes = closingTime % 100;
      const closingDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closingHours, closingMinutes);

      const oneHourInMillis = 60 * 60 * 1000;
      const timeUntilClose = closingDate - now;

      if (schedule.apertura <= currentTime && currentTime <= schedule.cierre) {
        if (timeUntilClose <= oneHourInMillis) {
          setStatus('Próximo a cerrar');
          setTextColor('text-yellow-500');
        } else {
          setStatus('Abierto');
          setTextColor('text-green-500');
        }
        setIsOpen(true);
      } else {
        setStatus('Cerrado');
        setTextColor('text-red-500');
        setIsOpen(false);
      }
    } else {
      setStatus('Cerrado');
      setTextColor('text-red-500');
      setIsOpen(false);
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
    const whatsappUrl = `https://wa.me/?text=¿Conoces ${coffee.name}?: ${window.location.href}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('¡Enlace copiado al portapapeles!');
  };

  if (loading) {
    return <div className="mt-24 text-3xl text-center text-white">Cargando...</div>;
  }

  const goToReviewPage = () => {
    if (coffee) {
      navigate('/review', { state: { cafeName: coffee.name } });
    } else {
      console.error('El café no está definido.');
    }
  };
  
  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  
  return (
    <div className='flex flex-col items-center justify-center w-screen'>
    <Top/>
    <div className="w-screen text-c2 sm:w-1/2">
      {coffee ? (
        <>
        <div className='p-4'>
          <div className="w-full overflow-x-auto rounded-lg">
              <Slider {...sliderSettings}>
                  {coffee.picsLinks?.map((picLink, index) => (
                                    <img
                  key={index}
                  src={picLink}
                  alt={`Imagen ${index + 1}`}
                  className="object-cover h-48 rounded-lg shadow-md"
                  onError={() => handleImageError(index)}
                />
                  ))}
              </Slider>
          </div>

          <h1 className="mt-2 text-3xl font-bold text-left">{coffee.name}</h1>
          
          <p className="mb-2 text-xl">
            {starRating(calculateAverageRating())}
            <span className="ml-2">{numRatings} valoraciones</span>
          </p>
          
            <p className='mb-8 text-xl'>
              <span className={`${textColor}`}> {status} - </span> Abre a las {coffee.schedules.lunes_viernes.apertura}
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

          <div className='flex flex-row items-center gap-1 mb-2'>
          <img src={location} className='w-4 h-4 mt-2'></img>
          <p className="text-lg ml-1`">{coffee.adress} - {coffee.neigh} </p>
          </div>

          <div className='flex flex-row items-center gap-1 mb-2'>
            <img src={clock} className='w-4 h-4 mt-2'></img>
            <p className={`text-xl`}>
              <span className={`${textColor} ml-1`}> {status} - </span> Abre a las {coffee.schedules.lunes_viernes.apertura}
            </p>
          </div>
          
          <div className='flex flex-row items-center gap-1 mb-2'>
          <img src={heartadd} className='w-4 h-4 mt-2'></img>
          <p className="ml-1 text-lg">¿Qué te pareció {coffee.name}?</p>
          </div>

          <div className='flex flex-col items-center justify-start w-full mt-4'>
            {/* <button onClick={handleCopyLink} className="px-4 py-2 mb-2 text-white bg-blue-600 rounded">
              Copiar Enlace
            </button> */}

            <button onClick={handleCopyLink} className="flex items-center justify-center w-4/5 gap-2 px-4 py-2 mb-2 font-medium text-c bg-b1 rounded-2xl">
              <img src={additem} className='flex-[1]'></img>
              <p className='text-center text-lg flex-[9]'>
              Compartir
              </p>
            </button>

            
            <button onClick={goToReviewPage} className="flex items-center justify-center w-4/5 gap-2 px-4 py-2 mb-2 font-medium text-c bg-b1 rounded-2xl">
              <img src={addsquare} className='flex-[1]'></img>
              <p className='text-center text-lg flex-[9]'>
              Agregar una reseña
              </p>
            </button>

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
