import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const CafeteriasList = () => {
  const [cafeterias, setCafeterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cafeterias'));
        const cafesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCafeterias(cafesList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCafeterias();
  }, []);

  if (loading) return <div className="text-center text-gray-600">Cargando...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold text-center text-white">Cafeterías</h1>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-center text-white">Las más populares</h2>
        <Slider {...sliderSettings}>
          {cafeterias.map((cafe, index) => (
            <div key={index} className="p-2">
              <Link to={`/cafe/${cafe.id}`}>
                <div className="relative h-40 overflow-hidden bg-white rounded-lg shadow-md">
                  <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-50">
                    <h2 className="text-lg font-semibold text-white">{cafe.name || 'Nombre no disponible'}</h2>
                    <p className="text-sm text-gray-300">{cafe.adress || 'Dirección no disponible'}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
      
      <div>
        <h2 className="mb-4 text-xl font-semibold text-center text-white">Nuevas Apariciones</h2>
        <Slider {...sliderSettings}>
          {cafeterias.map((cafe, index) => (
            <div key={index} className="p-2">
              <Link to={`/cafe/${cafe.id}`}>
                <div className="relative h-40 overflow-hidden bg-white rounded-lg shadow-md">
                  <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-50">
                    <h2 className="text-lg font-semibold text-white">{cafe.name || 'Nombre no disponible'}</h2>
                    <p className="text-sm text-gray-300">{cafe.adress || 'Dirección no disponible'}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CafeteriasList;
