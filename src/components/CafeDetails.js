import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const CafeDetails = () => {
  const { id } = useParams();
  const [cafe, setCafe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const docRef = doc(db, 'cafeterias', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCafe(docSnap.data());
        } else {
          setError('No se encontró la cafetería.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCafe();
  }, [id]);

  const handleShare = () => {
    const url = `${window.location.origin}/cafe/${id}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar al portapapeles: ', err);
    });
  };

  const handleShareWhatsApp = () => {
    const url = `${window.location.origin}/cafe/${id}`;
    const text = `¡Mira esta cafetería! ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;
  if (!cafe) return null;

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h1 className="mb-4 text-2xl font-semibold text-center text-gray-800">{cafe.name}</h1>
      <div className="p-4 bg-white rounded-lg shadow-md">
        <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-64 mb-4 rounded-lg" />
        <p className="text-gray-600"><strong>Dirección:</strong> {cafe.adress}</p>
        <p className="text-gray-600"><strong>Barrio:</strong> {cafe.neigh}</p>
        <p className="text-gray-600"><strong>Descripción:</strong> {cafe.description}</p>
        <p className="text-gray-600"><strong>Horarios:</strong> {cafe.schedules}</p>
        <p className="text-gray-600"><strong>Vegano:</strong> {cafe.vegan ? 'Sí' : 'No'}</p>
        <p className="text-gray-600"><strong>Apto Celíacos:</strong> {cafe.tac ? 'Sí' : 'No'}</p>
        <p className="text-gray-600"><strong>Pet Friendly:</strong> {cafe.pet ? 'Sí' : 'No'}</p>
        <p className="text-gray-600"><strong>Mesas Afuera:</strong> {cafe.outside ? 'Sí' : 'No'}</p>
        {cafe.instagram && (
          <a href={`https://www.instagram.com/${cafe.instagram}`} className="block mb-2 text-blue-500 hover:underline">Ir a Instagram</a>
        )}
        {cafe.menuLink && (
          <a href={cafe.menuLink} className="block mb-2 text-blue-500 hover:underline">Ver Menú</a>
        )}
        <p className="mb-2 text-gray-600">Para ver las reseñas, descargá la app en Google Play</p>
        
        <div className="flex mt-4 space-x-4">
          <button 
            onClick={handleShare} 
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Compartir
          </button>
          <button 
            onClick={handleShareWhatsApp} 
            className="px-4 py-2 font-semibold text-white bg-green-500 rounded hover:bg-green-600"
          >
            Compartir en WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default CafeDetails;
