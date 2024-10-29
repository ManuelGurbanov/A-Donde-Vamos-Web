import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, arrayRemove } from 'firebase/firestore';

const EditCoffeeForm = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const db = getFirestore();

  const [cafeData, setCafeData] = useState(null);
  const [formData, setFormData] = useState({});
  const [reviews, setReviews] = useState([]);
  const [schedules, setSchedules] = useState({
    lunes: { apertura: '', cierre: '', cerrado: false },
    martes: { apertura: '', cierre: '', cerrado: false },
    miercoles: { apertura: '', cierre: '', cerrado: false },
    jueves: { apertura: '', cierre: '', cerrado: false },
    viernes: { apertura: '', cierre: '', cerrado: false },
    sabado: { apertura: '', cierre: '', cerrado: false },
    domingo: { apertura: '', cierre: '', cerrado: false },
  });

  useEffect(() => {
    const fetchCafeData = async () => {
      try {
        const cafesRef = collection(db, 'cafeterias');
        const q = query(cafesRef, where('slugName', '==', slug));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          const cafeDoc = querySnapshot.docs[0];
          const cafe = cafeDoc.data();
          setCafeData({ ...cafe, id: cafeDoc.id });
          setFormData(cafe);
          setReviews(cafe.reviews || []);
          
          // Si los datos de horarios están disponibles, actualizarlos en el estado `schedules`
          if (cafe.schedules) {
            setSchedules(cafe.schedules);
          }
        } else {
          console.error('No se encontró ninguna cafetería con el slug especificado.');
        }
      } catch (error) {
        console.error('Error al obtener los datos de la cafetería:', error);
      }
    };
  
    fetchCafeData();
  }, [slug, db]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleScheduleChange = (day, type, value) => {
    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [day]: {
        ...prevSchedules[day],
        [type]: value,
      },
    }));
  };

  const toggleClosedDay = (day) => {
    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [day]: {
        ...prevSchedules[day],
        cerrado: !prevSchedules[day].cerrado,
      },
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!cafeData?.id) throw new Error('ID de cafetería no encontrado');
      
      const cafeRef = doc(db, 'cafeterias', cafeData.id);
      await updateDoc(cafeRef, { ...formData, schedules });
      alert('Cafetería actualizada exitosamente.');
      navigate(`/cafe/${slug}`);
    } catch (error) {
      console.error('Error al actualizar la cafetería:', error);
      alert('Error al actualizar la cafetería. Inténtalo de nuevo.');
    }
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reseña?")) return;

    try {
      if (!cafeData?.id) throw new Error('ID de cafetería no encontrado');

      const cafeRef = doc(db, 'cafeterias', cafeData.id);
      await updateDoc(cafeRef, {
        reviews: arrayRemove(review),
      });
      setReviews((prev) => prev.filter((r) => r.userId !== review.userId));
      alert('Reseña eliminada exitosamente.');
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
      alert('Error al eliminar la reseña. Inténtalo de nuevo.');
    }
  };

  if (!cafeData) return <p className="text-center text-gray-500">Cargando datos de la cafetería...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Editar Cafetería</h1>

      <label className="block text-gray-700 font-semibold mb-2">Nombre:</label>
      <input type="text" name="name" value={formData.name || ''} onChange={handleChange}
             className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <label className="block text-gray-700 font-semibold mb-2">Dirección:</label>
      <input type="text" name="address" value={formData.adress || ''} onChange={handleChange}
             className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <label className="block text-gray-700 font-semibold mb-2">Descripción:</label>
      <textarea name="description" value={formData.description || ''} onChange={handleChange}
                className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <label className="block text-gray-700 font-semibold mb-2">Link de Google Maps:</label>
      <input type="url" name="googleLink" value={formData.googleLink || ''} onChange={handleChange}
             className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <label className="block text-gray-700 font-semibold mb-2">Instagram:</label>
      <input type="text" name="instagram" value={formData.instagram || ''} onChange={handleChange}
             className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <label className="block text-gray-700 font-semibold mb-2">Link del Menú:</label>
      <input type="url" name="menuLink" value={formData.menuLink || ''} onChange={handleChange}
             className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <label className="block text-gray-700 font-semibold mb-2">Barrio:</label>
      <input type="text" name="neigh" value={formData.neigh || ''} onChange={handleChange}
             className="w-full p-2 mb-4 border border-gray-300 rounded" />

      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="cafeNotable" checked={formData.cafeNotable || false} onChange={handleChange}
                 className="form-checkbox text-indigo-600" />
          <span className="text-gray-700 font-semibold">Café Notable</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="coworking" checked={formData.coworking || false} onChange={handleChange}
                 className="form-checkbox text-indigo-600" />
          <span className="text-gray-700 font-semibold">Co-Working</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="pet" checked={formData.pet || false} onChange={handleChange}
                 className="form-checkbox text-indigo-600" />
          <span className="text-gray-700 font-semibold">Permite mascotas</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="terraza" checked={formData.terraza || false} onChange={handleChange}
                 className="form-checkbox text-indigo-600" />
          <span className="text-gray-700 font-semibold">Con Terraza</span>
        </label>
        <label className="flex items-center space-x-2">
          <input type="checkbox" name="vegan" checked={formData.vegan || false} onChange={handleChange}
                 className="form-checkbox text-indigo-600" />
          <span className="text-gray-700 font-semibold">Opciones Veganas</span>
        </label>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">Reseñas:</h3>
      {reviews.map((review, index) => (
        <div key={index} className="p-4 mb-4 bg-gray-100 rounded-lg shadow-sm">
          <p className="text-gray-800"><strong>{review.user}</strong> ({review.date}): {review.text}</p>
          <button type="button" onClick={() => handleDeleteReview(review)}
                  className="mt-2 text-sm text-red-600 hover:underline">Eliminar Reseña</button>
        </div>
      ))}

            {/* Horarios por día */}
            {Object.keys(schedules).map((day) => (
        <div key={day} className="mb-4">
          <label className="block text-gray-700 font-semibold capitalize">{day}</label>
          <div className="flex items-center">
            <label className="mr-2">Cerrado:</label>
            <input
              type="checkbox"
              checked={schedules[day].cerrado}
              onChange={() => toggleClosedDay(day)}
            />
          </div>
          {!schedules[day].cerrado && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={schedules[day].apertura}
                onChange={(e) => handleScheduleChange(day, 'apertura', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded"
                placeholder="Apertura (HHMM)"
              />
              <input
                type="text"
                value={schedules[day].cierre}
                onChange={(e) => handleScheduleChange(day, 'cierre', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded"
                placeholder="Cierre (HHMM)"
              />
            </div>
          )}
        </div>
      ))}
      
      <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 mt-6">
        Guardar Cambios
      </button>
    </form>
  );
};

export default EditCoffeeForm;
