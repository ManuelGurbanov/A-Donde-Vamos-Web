import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import CoffeeCard from './CoffeeCard';
const Home = () => {
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
    <div className="p-4 bg-red-900">
      <h1 className="mt-2 mb-1 text-2xl font-bold text-center text-c">¿A Dónde Vamos?</h1>

      {currentUser && (
        <p className="mb-1 text-xl italic text-center text-c">Bienvenido, <strong>{currentUser.displayName}</strong> </p>
      )}

      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-left text-c">Las más populares</h2>
        <Slider {...sliderSettings}>
          {cafeterias.map((cafe, index) => (
            <CoffeeCard key={index} cafe={cafe} />
          ))}
        </Slider>
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-left text-c">Nuevas Apariciones</h2>
        <Slider {...sliderSettings}>
          {cafeterias.map((cafe, index) => (
            <CoffeeCard key={index} cafe={cafe} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Home;
