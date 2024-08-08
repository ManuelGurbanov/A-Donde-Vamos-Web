import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (review.trim() === '' || rating === 0) return;

    const newReview = `${currentUser.displayName || 'Anonymous'}|${rating}|${review}`;
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

  const starRating = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return <div className="p-4 text-white">Cargando...</div>;
  }

  return (
    <div className="p-4 text-white">
      {coffee ? (
        <>
          <h1 className="mb-4 text-3xl font-bold">{coffee.name}</h1>
          <p className="mb-4 text-xl">{coffee.neigh}</p>
          <p className="mb-2">{coffee.adress}</p>
          <p className="mb-4">{coffee.description}</p>
          <img src={coffee.picsLinks?.[0] || 'default-image.jpg'} alt={coffee.name} className="object-cover w-full h-64 rounded-lg shadow-md" />
          {/* flex con las otras picsLinks */}
          <div className="flex flex-row mt-4 space-x-2">
            {coffee.picsLinks?.slice(1).map((pic, index) => (
              <img key={index} src={pic} alt={coffee.name} className="object-cover w-1/3 h-40 rounded-lg shadow-md" />
            ))}
          </div>
          {currentUser && (
            <form onSubmit={handleReviewSubmit} className="mt-4">
                  <h2 className="mt-4 mb-4 text-xl font-semibold text-white">{currentUser.displayName}</h2>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Escribe tu reseña aquí"
                    className="w-full p-2 mb-2 text-white bg-gray-800 border rounded"
                  />
                  <div className="flex flex-col items-center mb-2">
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
                  <button type="submit" className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">Enviar Reseña</button>
                </form>
            )}
          
          <div className="mt-4 mb-16">
            <h2 className="mb-2 text-xl font-semibold">Reseñas:</h2>
            <div className="space-y-4">
              {reviews.map((rev, index) => {
                const [user, rating, text] = rev.split('|');
                const numericRating = Number(rating);
                return (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg shadow-md">
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold">{user}</p>
                      <p className="text-yellow-400">{starRating(numericRating)}</p>
                    </div>
                    <p>{text}</p>
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
