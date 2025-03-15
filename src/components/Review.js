import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../contexts/AuthContext';
import { CafeContext } from './CafeContext';
import StarRating from './StarRating';
import screen2 from '../img/screen2.png';
import fav from '../img/fav.png';

import { query, collection, where, getDocs } from 'firebase/firestore';

const Review = ({ selectedCafe: propSelectedCafe, onClose }) => {
  const navigate = useNavigate();
  const { cafes } = useContext(CafeContext);
  const { currentUser } = useAuth(); // Asegúrate de que currentUser tiene los datos del usuario

  const { state } = useLocation();
  const [cafe, setCafe] = useState(propSelectedCafe || state?.selectedCafe || null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState(''); // Para almacenar el nombre de usuario

  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
  
    if (!currentUser) {
      setErrorMessage('Por favor, inicia sesión para hacer una reseña.');
    } else {
      // Recuperar el nombre de usuario de Firestore si currentUser está disponible
      fetchUserData(currentUser.uid);
    }
  
  if (state?.selectedCafe) {
    console.log('Cafe seleccionado:', cafe);
    setCafe(state.selectedCafe);
  }
}, [currentUser, propSelectedCafe, state]);
  

  // Función para obtener el nombre de usuario desde Firestore
  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUsername(userData.username); // Aquí se obtiene el nombre de usuario
      } else {
        console.error('No se encontró el usuario en Firestore');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  const handleCafeChange = async (e) => {
    const cafeId = e.target.value;
    if (!cafeId) {
      setErrorMessage('No se ha seleccionado ninguna cafetería.');
      setCafe(null);
      return;
    }

    const cafeDocRef = doc(db, 'cafeterias', cafeId);
    try {
      const cafeDocSnap = await getDoc(cafeDocRef);
      if (cafeDocSnap.exists()) {
        const cafeData = cafeDocSnap.data();
        setCafe({ id: cafeId, ...cafeData });
      } else {
        setErrorMessage('No se encontró el documento de la cafetería.');
        setCafe(null);
      }
    } catch (error) {
      setErrorMessage('Error al obtener los datos de la cafetería.');
      setCafe(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log('Cafetería: a Reseñar', cafe);
  
    if (!cafe) {
      setErrorMessage('No hay cafetería seleccionada.');
      return;
    }
  
    if (!currentUser) {
      setErrorMessage('Por favor, inicia sesión para hacer una reseña.');
      return;
    }

    if (!cafe.slugName) {
      setErrorMessage('Error en los datos de la cafetería.');
      console.log('Cafetería:', cafe);
      return;
    }
  
    // Formato de fecha
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getFullYear()).slice(2)}`;
  
    const reviewData = {
      userId: currentUser.uid,
      user: username || 'Anonymous',
      rating,
      text: review,
      likes: 0,
      dislikes: 0,
      votes: {},
      date: formattedDate
    };
  
    try {
      // Buscar la cafetería por el slug
      const coffeeQuery = query(
        collection(db, 'cafeterias'),
        where('slugName', '==', cafe.slugName)
      );
      const querySnapshot = await getDocs(coffeeQuery);
  
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const cafeRef = doc(db, 'cafeterias', docSnap.id);
  
        // Actualizar las reseñas y las estadísticas de calificación
        await updateDoc(cafeRef, {
          reviews: arrayUnion(reviewData),
          totalRatings: (docSnap.data().totalRatings || 0) + rating,
          numRatings: (docSnap.data().numRatings || 0) + 1
        });
  
        setSuccessMessage('Reseña enviada correctamente.');
        setHasRated(true);
        navigate('/');
      } else {
        setErrorMessage('No se encontró la cafetería con ese slug.');
      }
    } catch (error) {
      setErrorMessage('Error al enviar la reseña.');
      console.error(error);
    }
  };
  

  const normalizeText = (text) => 
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  const filteredCafes = cafes
    .filter(cafe => {
        return cafe.name && normalizeText(cafe.name).includes(normalizeText(searchTerm));
    })
    .sort((a, b) => a.name.localeCompare(b.name));


  const handleCancel = () => {
    setCafe(null);
    setReview('');
    setRating(0);
    setHasRated(false);
    setErrorMessage('');
    setSuccessMessage('');

    if (onClose) onClose();
  };

  return (
    <>
      <div
        onClick={handleCancel}
        className="absolute top-0 bottom-0 left-0 right-0 w-screen h-screen bg-black bg-opacity-80"
      ></div>
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 py-0 bg-b1 text-c h-full max-h-[80vh] w-full sm:w-1/2 shadow-lg overflow-hidden rounded-lg m-auto">
        
        {!cafe && (
                  <div className="sticky top-0 z-10 bg-b1">
                  <h2 className="mt-6 mb-4 text-lg font-bold text-center">
                    Reseñar una Cafetería
                  </h2>
                  <div className="relative flex-col items-center w-full m-auto mb-4 sm:w-1/2">
                    <input
                      type="text"
                      placeholder="Nombre de Cafetería..."
                      className="w-full h-full p-2 text-center text-black border rounded placeholder-c"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img
                      src={screen2}
                      alt="Search Icon"
                      className="absolute w-5 h-5 transform -translate-y-1/2 top-1/2 left-3"
                    />
                  </div>
                </div>
          )}

  
        {/* Contenido desplazable */}
        <div className="flex flex-col w-full space-y-4 overflow-y-auto h-[calc(75vh-120px)] overflow-x-hidden">
          {!cafe ? (
            filteredCafes.map((cafe) => (
              <React.Fragment key={cafe.id}>
                <hr className="border-solid border-1 border-c" />
                <div
                  className="p-2 rounded cursor-pointer"
                  onClick={() => setCafe(cafe)}
                >
                  {cafe.name}
                </div>
              </React.Fragment>
            ))
          ) : (
            <div>
              <hr className="border-solid border-1 border-c2 w-screen"></hr>
              <h3
                className="w-full mt-2 text-lg text-left text-opacity-60 text-c2"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  fontSize: "48px",
                }}
              >
                <span className="text-2xl font-bold text-opacity-100 text-c2">
                  {cafe.name}
                </span>
              </h3>
              <h2 className="mb-2 text-sm italic">
                {cafe.adress}, <span className="text-sm">{cafe.neigh}</span>
              </h2>
  
              <hr className="mb-2 border-solid border-1 border-c2"></hr>
  
              <div className="flex justify-between w-full mb-2 text-c2">
                <h1>Fecha</h1>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
  
              <hr className="mb-2 border-solid border-1 border-c2"></hr>
  
              <form
                onSubmit={handleReviewSubmit}
                className="flex flex-col items-center bg-b1"
              >
                <section className="flex flex-row items-start justify-around w-full">
                  <div className="flex flex-col w-full h-full gap-2">
                    <h3 className=" text-c2">Calificá</h3>
                    <StarRating initialRating={rating} onRatingChange={setRating} />
                  </div>
  
                  <div>
                    <h3 className=" text-c2">Favorito</h3>
                    <img src={fav} className="w-8 h-8 mt-2 ml-4" />
                  </div>
                </section>
  
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full p-2 mb-4 border rounded border-c2 bg-b1 text-c2 placeholder-c2"
                  placeholder="Escribe tu reseña aquí..."
                  rows="4"
                />
  
                <button
                  type="submit"
                  disabled={!currentUser || rating === 0 || hasRated}
                  className="px-4 py-2 text-white rounded bg-c2 disabled:bg-gray-400"
                >
                  Enviar Reseña
                </button>
  
                {errorMessage && (
                  <div className="mt-4 mb-4 font-bold text-center text-red-500">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="mt-4 mb-4 font-bold text-center text-green-500">
                    {successMessage}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

  export default Review;