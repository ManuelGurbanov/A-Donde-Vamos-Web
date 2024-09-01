import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CafeContext } from './CafeContext'; // Importa el contexto

import StarRating from './StarRating';
import Top from './Top';

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cafes } = useContext(CafeContext); // Usa el contexto para obtener la lista de cafeterías
  const { currentUser } = useAuth();
  
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');

    const cafeName = location.state?.cafeName;

    if (cafeName) {
      const fetchCafeData = async () => {
        try {
          const cafesCollectionRef = collection(db, 'cafeterias');
          const q = query(cafesCollectionRef, where('name', '==', cafeName));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const cafeDoc = querySnapshot.docs[0];
            setSelectedCafe({ id: cafeDoc.id, ...cafeDoc.data() });
          } else {
            setErrorMessage('No se encontró la cafetería.');
            setSelectedCafe(null);
          }
        } catch (error) {
          setErrorMessage('Error al buscar la cafetería.');
          setSelectedCafe(null);
        }
      };

      fetchCafeData();
    }
  }, [location.state]);

  const handleCafeChange = async (e) => {
    const cafeId = e.target.value;
    if (!cafeId) {
      setErrorMessage('No se ha seleccionado ninguna cafetería.');
      setSelectedCafe(null);
      return;
    }
    
    const cafeDocRef = doc(db, 'cafeterias', cafeId);
    try {
      const cafeDocSnap = await getDoc(cafeDocRef);
      if (cafeDocSnap.exists()) {
        const cafeData = cafeDocSnap.data();
        setSelectedCafe({ id: cafeId, ...cafeData });
      } else {
        setErrorMessage('No se encontró el documento de la cafetería.');
        setSelectedCafe(null);
      }
    } catch (error) {
      setErrorMessage('Error al obtener los datos de la cafetería.');
      setSelectedCafe(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCafe) {
      setErrorMessage('No hay cafetería seleccionada.');
      return;
    }

    if (!currentUser) {
      setErrorMessage('Por favor, inicia sesión para hacer una reseña.');
      return;
    }

    if (!selectedCafe.id) {
      setErrorMessage('Error en los datos de la cafetería.');
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

      setSuccessMessage('Reseña enviada correctamente.');
      setHasRated(true);
      navigate('/'); // Navega a la página principal o donde desees después de enviar la reseña
    } catch (error) {
      setErrorMessage('Error al enviar la reseña.');
    }
  };

  return (
    <>
      <Top text={"Reseñar"}></Top>
      <div className="p-8 m-5 mt-4 rounded shadow-md bg-c2 text-c">
        <h2 className="mb-4 text-2xl font-bold">Escribe una reseña</h2>
        {errorMessage && (
          <div className="mb-4 text-red-500">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-green-500">
            {successMessage}
          </div>
        )}
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
