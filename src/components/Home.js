import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import CoffeeCard from './CoffeeCard';
import AdBanner from './AdBanner';
import Top from './Top';

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
    slidesToScroll: 1,
  };

  return (
    <>
    <Top/>

    <div className='m-auto sm:w-1/2'>
      {/* Encabezado */}


      {/* Contenido principal */}
      <div className="p-4 bg-c md:px-20 lg:px-32 xl:px-48">
        {/* Mensaje de bienvenida para usuarios autenticados */}
        {currentUser && (
          <p className="mb-1 text-xl italic text-center text-b2 md:text-2xl">
            Bienvenido, <strong>{currentUser.displayName}</strong>
          </p>
        )}

        {/* Sección: Las más populares */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Las más populares</h2>
          <Slider {...sliderSettings}>
            {cafeterias.map((cafe, index) => (
              <CoffeeCard key={index} cafe={cafe} />
            ))}
          </Slider>
        </div>

        {/* Banner publicitario */}
        <AdBanner />

        {/* Sección: Tus Favoritas */}
        <div>
          <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Tus Favoritas</h2>
          <Slider {...sliderSettings}>
            {cafeterias.map((cafe, index) => (
              <CoffeeCard key={index} cafe={cafe} />
            ))}
          </Slider>
        </div>

        {/* Sección: Cerca Tuyo */}
        <div>
          <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Cerca Tuyo</h2>
          <Slider {...sliderSettings}>
            {cafeterias.map((cafe, index) => (
              <CoffeeCard key={index} cafe={cafe} />
            ))}
          </Slider>
        </div>

        {/* Sección: Nuevas Apariciones */}
        <div className='mb-24'>
          <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Nuevas Apariciones</h2>
          <Slider {...sliderSettings}>
            {cafeterias.map((cafe, index) => (
              <CoffeeCard key={index} cafe={cafe} />
            ))}
          </Slider>
        </div>
      </div>
    </div>
    </>
  );
};

export default Home;