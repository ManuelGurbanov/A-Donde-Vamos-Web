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

const CoffeeDetails = () => {
  const { id } = useParams();
  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCoffee = async () => {
      try {
        const docRef = doc(db, 'cafeterias', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCoffee(docSnap.data());
          setReviews(docSnap.data().reviews || []);
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
  }, [id]);

  const handleImageError = (index) => {
    setCoffee(prevState => ({
      ...prevState,
      picsLinks: prevState.picsLinks.filter((_, i) => i !== index)
    }));
  };
  

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (review.trim() === '' || rating === 0) return;

    const newReview = {
      user: currentUser.displayName || 'Anonymous',
      rating,
      text: review,
      likes: 0,
      dislikes: 0,
      votes: {}
    };
    const updatedReviews = [...reviews, newReview];
    
    try {
      const docRef = doc(db, 'cafeterias', id);
      await updateDoc(docRef, { reviews: updatedReviews });
      setReviews(updatedReviews);
      setReview('');
      setRating(0);
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
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="p-4 text-white">Cargando...</div>;
  }

  return (
    <div className="p-4 text-c2">
      {coffee ? (
        <>
          <h1 className="mb-4 text-3xl font-bold text-center">{coffee.name}</h1>
          <p className="mb-4 italic text-center">{coffee.description}</p>
          <p className="mb-4 text-xl"> - {coffee.adress}, <strong className='font-black'> {coffee.neigh} </strong></p>
          <div className="flex flex-wrap items-center mb-4">
            {coffee.outside && <img src={outsideIcon} alt="Outside" className="w-8 h-8 mr-2" />}
            {coffee.pet && <img src={petIcon} alt="Pet Friendly" className="w-8 h-8 mr-2" />}
            {coffee.tac && <img src={tacIcon} alt="Take Away Cup" className="w-8 h-8 mr-2" />}
            {coffee.vegan && <img src={veganIcon} alt="Vegan Options" className="w-8 h-8 mr-2" />}
          </div>

          <img 
                src={coffee.picsLinks?.[0] || 'default-image.jpg'} 
                alt={coffee.name} 
                className="object-cover w-full h-64 rounded-lg shadow-md" 
                onError={() => handleImageError(0)}
          />

          <div className="flex flex-row mt-4 space-x-2">
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

          {currentUser && (
            <form onSubmit={handleReviewSubmit} className="mt-4">
              <div className='flex items-center gap-2 text-left max-h-16'>
                <img src={screen4} className='w-4 h-4'></img>
                <h2 className="mt-4 mb-4 text-xl font-semibold text-white">{currentUser.displayName}</h2>
              </div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Escribe tu reseña aquí"
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
                <span className="ml-2 text-xl text-yellow-400">{'★'.repeat(Math.round(rating))} {'☆'.repeat(5 - Math.round(rating))}</span>
              </div>

              {currentUser ? (
                    <button type="submit" className="p-2 text-white rounded bg-c1 hover:bg-c2">
                      Enviar Reseña
                    </button>
                  ) : (
                    <p className="p-2 text-4xl text-white">
                      Iniciá Sesión para dar reseñas.
                    </p>
                  )}
            </form>
          )}
          <div className="mt-4 mb-16">
            <h2 className="mb-2 text-xl font-semibold">Reseñas:</h2>
            <div className="space-y-4">
              {reviews.map((rev, index) => {
                const userVote = rev.votes[currentUser?.uid];
                return (
                  <div key={index} className="p-4 mt-4 rounded-lg shadow-md bg-c2">
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-white">{rev.user}</p>
                      <p className="text-yellow-400">{starRating(rev.rating)}</p>
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
