import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import outsideIcon from '../img/outside.png';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';
import screen4 from '../img/screen4.png';
import fullStar from '../img/fullStar.png';
import halfStar from '../img/halfStar.png';
import emptyStar from '../img/emptyStar.png';

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
          }
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
      stars.push(<img key={`full-${i}`} src={fullStar} alt="Full Star" className="inline-block w-6 h-6" />);
    }
    
    if (hasHalfStar) {
      stars.push(<img key="half" src={halfStar} alt="Half Star" className="inline-block w-6 h-6" />);
    }
    
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<img key={`empty-${i}`} src={emptyStar} alt="Empty Star" className="inline-block w-6 h-6" />);
    }
    
    return stars;
  };
  
  const calculateAverageRating = () => {
    if (numRatings === 0) return 0;
    return (totalRatings / numRatings).toFixed(1);
  };

  if (loading) {
    return <div className="p-4 text-white">Cargando...</div>;
  }

  return (
    <div className="text-c2">
      {coffee ? (
        <>
        <div className='p-4 bg-white'>
          <h1 className="mb-2 text-3xl font-bold text-left">{coffee.name}</h1>
          <p className="max-w-screen-md mb-2 text-xl"> - {coffee.adress}, <strong className='font-black'> {coffee.neigh} </strong></p>
          <p className="mb-2 text-xl">
            {starRating(calculateAverageRating())}
          </p>
        </div>
          <p className="m-4 text-2xl italic font-bold text-center">{coffee.description}</p>
          <div className="flex flex-wrap justify-center p-4 mb-2 items-cente">
            {coffee.outside && <img src={outsideIcon} alt="Outside" className="w-8 h-8 mr-2" />}
            {coffee.pet && <img src={petIcon} alt="Pet Friendly" className="w-8 h-8 mr-2" />}
            {coffee.tac && <img src={tacIcon} alt="Take Away Cup" className="w-8 h-8 mr-2" />}
            {coffee.vegan && <img src={veganIcon} alt="Vegan Options" className="w-8 h-8 mr-2" />}
          </div>
          <img 
                src={coffee.picsLinks?.[0] || 'default-image.jpg'} 
                alt={coffee.name} 
                className="object-cover w-full h-64 p-4 rounded-lg" 
                onError={() => handleImageError(0)}
          />
          <div className="flex flex-row p-4 mt-4 space-x-2">
            {coffee.picsLinks?.slice(1).map((pic, index) => (
              <img 
                key={index + 1} 
                src={pic} 
                alt={coffee.name} 
                className="object-cover w-1/3 h-40 rounded-lg shadow-md" 
                onError={() => handleImageError(index + 1)} 
              />
            ))}
          </div>
          {currentUser && !hasRated && (
            <form onSubmit={handleReviewSubmit} className="p-4 mt-4">
              <div className='flex items-center gap-2 text-left max-h-16'>
                <img src={screen4} className='w-4 h-4' alt="Icon" />
                <h2 className="mt-4 mb-4 text-xl font-semibold text-white">{currentUser.displayName}</h2>
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Escribe tu reseña aquí (opcional)"
                className="w-full p-2 mb-2 text-white border rounded bg-c2"
              />
              <div className="flex flex-col items-center mb-2 text-c2">
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className='flex gap-3 mt-4'>
                  <button type="submit" className="p-2 bg-gray-200 rounded text-c1 hover:bg-b2 hover:text-white">
                    Enviar Reseña
                    </button>
                  <span className="ml-2 text-xl">
                    {starRating(rating)}
                  </span>
                </div>
              </div>
            </form>
          )}
          {hasRated && (
            <p className="p-4 text-xl font-bold text-center text-c2">¡Gracias por tu comentario!</p>
          )}
          <div className="p-4 mt-4 mb-16">
            <h2 className="mb-2 text-xl font-semibold">Reseñas:</h2>
            <div className="space-y-4">
              {reviews.map((rev, index) => {
                const userVote = rev.votes[currentUser?.uid];
                return (
                  <div key={index} className="p-4 mt-4 rounded-lg shadow-md bg-c1">
                  <div key={index} className="p-4 mt-4 rounded-lg shadow-md bg-c1">
                    {currentUser && currentUser.uid === rev.userId && (
                      <button
                        onClick={() => handleDeleteReview(index)}
                        className="ml-4 text-red-500"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>


                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-white">{rev.user}</p>
                      <div className="text-yellow-400">{starRating(rev.rating)}</div>
                    </div>
                    <p className='text-white'>{rev.text}</p>
                    <div className="flex items-center mt-4 space-x-4 text-white">
                      <button 
                        onClick={() => handleVote(index, 'like')} 
                        className={`p-1 rounded ${userVote === 'like' ? 'bg-c2' : 'bg-transparent'} hover:bg-c1`}
                      >
                        👍
                      </button>
                      <p>{rev.likes}</p>
                      <button 
                        onClick={() => handleVote(index, 'dislike')} 
                        className={`p-1 rounded ${userVote === 'dislike' ? 'bg-c2' : 'bg-transparent'} hover:bg-c1`}
                      >
                        👎
                      </button>
                      <p>{rev.dislikes}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <p>Error!</p>
      )}
    </div>
  );
};

export default CoffeeDetails;
