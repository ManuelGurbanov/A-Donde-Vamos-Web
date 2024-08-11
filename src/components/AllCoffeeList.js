import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../contexts/AuthContext';
import CoffeeCard from './CoffeeCard'; // Importa el nuevo componente

const AllCoffeeList = () => {
  const [cafeterias, setCafeterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

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

  if (loading) return <div className="mt-24 text-3xl text-center text-white">Cargando Cafeterías...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="p-4">
      <h1 className="mt-2 mb-4 text-2xl text-center text-gray-200">¿A Dónde Vamos?</h1>

      {currentUser && (
        <p className="mb-4 text-xl text-center text-white">Bienvenido, <strong>{currentUser.displayName}</strong></p>
      )}

      <div className="mb-8">
        <h2 className="mb-4 text-xl text-left text-white">Las más populares</h2>
        <Slider {...sliderSettings}>
          {cafeterias.map((cafe, index) => (
            <CoffeeCard key={index} cafe={cafe} />
          ))}
        </Slider>
      </div>
      <div>
        <h2 className="mb-4 text-xl font-semibold text-left text-white">Nuevas Apariciones</h2>
        <Slider {...sliderSettings}>
          {cafeterias.map((cafe, index) => (
            <CoffeeCard key={index} cafe={cafe} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default AllCoffeeList;
