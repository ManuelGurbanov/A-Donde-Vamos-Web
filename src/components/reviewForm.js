import { useState } from 'react';
import { useAuth } from '../firebase/firebase'; // Ajusta la ruta según sea necesario
import { getFirestore, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

const ReviewForm = ({ cafeId }) => {
  const { user, signInWithGoogle } = useAuth();
  const [reviewText, setReviewText] = useState('');
  const firestore = getFirestore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      console.log('Usuario no autenticado');
      return;
    }

    if (!cafeId) {
      console.error('ID de la cafetería no disponible');
      return;
    }

    // Añadir la reseña a Firestore
    try {
      const cafeDocRef = doc(firestore, 'cafeterias', cafeId.toString()); // Convierte cafeId a string si es necesario
      await updateDoc(cafeDocRef, {
        reviews: arrayUnion(reviewText)
      });
      console.log('Reseña agregada correctamente');
      setReviewText('');
    } catch (error) {
      console.error('Error al agregar reseña:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-gray-600">
        <p>Para dejar una reseña, por favor <button onClick={signInWithGoogle} className="text-blue-500 hover:underline">inicia sesión</button>.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block mb-2 text-gray-800" htmlFor="review">Deja tu reseña:</label>
      <textarea
        id="review"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        rows="4"
        required
      />
      <button type="submit" className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600">Enviar Reseña</button>
    </form>
  );
};

export default ReviewForm;
