import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const CafeteriasList = () => {
  const [cafeterias, setCafeterias] = useState([]);
  const [currentCafeIndex, setCurrentCafeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cafeterias'));
        const cafesList = querySnapshot.docs.map(doc => doc.data());
        setCafeterias(cafesList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCafeterias();
  }, []);

  const handlePrevious = () => {
    setCurrentCafeIndex((prevIndex) => (prevIndex === 0 ? cafeterias.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentCafeIndex((prevIndex) => (prevIndex === cafeterias.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const cafe = cafeterias[currentCafeIndex];

  return (
    <div className="flex flex-col p-8 mx-auto sm:h-screen max-w-screen">
      <h1 className="mb-8 text-5xl font-bold text-center text-blue-600">Cafeterías</h1>
      <div className="grid h-full gap-4 bg-white rounded-lg shadow-md lg:grid-cols-2">
        <div className="p-6 overflow-y-auto">
          <h2 className="mb-4 text-4xl font-semibold text-gray-800">{cafe.name || 'Nombre no disponible'}</h2>
          <p className="mb-2 text-gray-600"><strong>Dirección:</strong> {cafe.adress || 'No disponible'}</p>
          <p className="mb-2 text-gray-600"><strong>Barrio:</strong> {cafe.neigh || 'No disponible'}</p>
          <p className="mb-2 text-gray-600"><strong>Descripción:</strong> {cafe.description || 'No disponible'}</p>
          {cafe.instagram && (
            <a href={`https://www.instagram.com/${cafe.instagram}`} className="block mb-2 text-blue-500 hover:underline">Instagram</a>
          )}
          <p className="mb-2 text-gray-600"><strong>Puntaje:</strong> {cafe.score !== undefined ? cafe.score : 'No disponible'}</p>
          <p className="mb-2 text-gray-600"><strong>Horarios:</strong> {cafe.schedules || 'No disponible'}</p>
          <p className="mb-2 text-gray-600"><strong>Vegano:</strong> {cafe.vegan ? 'Sí' : 'No'}</p>
          <p className="mb-2 text-gray-600"><strong>Apto Celíacos:</strong> {cafe.tac ? 'Sí' : 'No'}</p>
          <p className="mb-2 text-gray-600"><strong>Pet Friendly:</strong> {cafe.pet ? 'Sí' : 'No'}</p>
          <p className="mb-2 text-gray-600"><strong>Mesas Afuera:</strong> {cafe.outside ? 'Sí' : 'No'}</p>
          {cafe.menuLink && (
            <a href={cafe.menuLink} className="block mb-2 text-blue-500 hover:underline">Ver Menú</a>
          )}
          {cafe.reviews && cafe.reviews.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Reseñas</h3>
              <ul className="list-disc list-inside">
                {cafe.reviews.map((review, index) => (
                  <li key={index} className="text-gray-600">{review}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 p-6">
          {cafe.picsLinks && cafe.picsLinks.length > 0 ? (
            cafe.picsLinks.slice(0, 4).map((link, index) => (
              <img key={index} src={link} alt={`Foto ${index + 1}`} className="object-cover w-full h-48 rounded-lg" />
            ))
          ) : (
            <div className="col-span-2 text-center text-gray-600">No hay fotos disponibles</div>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button 
          onClick={handlePrevious} 
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Anterior
        </button>
        <button 
          onClick={handleNext} 
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default CafeteriasList;
