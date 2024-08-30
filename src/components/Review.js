import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CafeContext } from './CafeContext'; // Asegúrate de importar el contexto

import StarRating from './StarRating';
import Top from './Top';

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cafes } = useContext(CafeContext); // Usar el contexto para obtener la lista de cafeterías
  const { currentUser } = useAuth();
  
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    const cafeFromLocation = location.state?.coffee;
    if (cafeFromLocation) {
      setSelectedCafe(cafeFromLocation);
    }
  }, [location.state]);

  const handleCafeChange = async (e) => {
    const cafeId = e.target.value;
    const cafeDocRef = doc(db, 'cafeterias', cafeId);
    const cafeDocSnap = await getDoc(cafeDocRef);
    if (cafeDocSnap.exists()) {
      setSelectedCafe(cafeDocSnap.data());
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCafe || !currentUser) {
      console.log('No hay cafetería seleccionada o usuario no autenticado.');
      return;
    }

    const reviewData = {
      userId: currentUser.uid,
      user: currentUser.displayName || 'Anonymous',
      rating,
      text: review,
      likes: 0,
      dislikes: 0,
      votes: {}
    };

    try {
      const cafeRef = doc(db, 'cafeterias', selectedCafe.id);

      await updateDoc(cafeRef, {
        reviews: arrayUnion(reviewData),
        totalRatings: (selectedCafe.totalRatings || 0) + rating,
        numRatings: (selectedCafe.numRatings || 0) + 1
      });

      console.log('Reseña enviada correctamente');
      setHasRated(true);
      navigate('/'); // Navega a la página principal o a donde desees después de enviar la reseña
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <>
    <Top text={"Reseñar"}></Top>
    <div className="p-8 m-5 mt-4 rounded shadow-md bg-c2 text-c">
      <h2 className="mb-4 text-2xl font-bold">Escribe una reseña</h2>
      {!selectedCafe ? (
        <div>
          <h3 className="mb-4 text-xl">Selecciona una cafetería</h3>
          <select onChange={handleCafeChange} className="w-full p-2 mb-4 text-black border rounded">
            <option value="">Selecciona una cafetería</option>
            {cafes.map(cafe => (
              <option key={cafe.id} value={cafe.id}>
                {cafe.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <h3 className="mb-4 text-xl italic font-bold">{selectedCafe.name}</h3>
          <form onSubmit={handleReviewSubmit}>
            <StarRating initialRating={rating} onRatingChange={setRating} />

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full p-2 mb-4 text-black border rounded"
              placeholder="Escribe tu reseña aquí..."
              rows="4"
            />
            <button
              type="submit"
              disabled={rating === 0 || hasRated}
              className="px-4 py-2 text-white bg-blue-600 rounded disabled:bg-gray-400"
            >
              Enviar Reseña
            </button>
          </form>
        </div>
      )}
    </div>
    </>
  );
};

export default Review;
