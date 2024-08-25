import React, { useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../contexts/AuthContext';

import CoffeeCard from './CoffeeCard';
import AdBanner from './AdBanner';
import Top from './Top';
import { CafeContext } from './CafeContext';

const Home = () => {
  const { cafes, loading, error } = useContext(CafeContext);
  const { currentUser } = useAuth();

  if (loading) return <div className="mt-24 text-3xl text-center text-white">Cargando Cafeterías...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  // Ordenar las cafeterías por valoraciones (supongo que hay un campo 'valoraciones')
  const sortedCafes = [...cafes].sort((a, b) => (b.valoraciones || 0) - (a.valoraciones || 0));

  // Tomar las 5 cafeterías con más valoraciones (o el número que prefieras)
  const popularCafes = sortedCafes.slice(0, 5);

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
      <Top />

      <div className='m-auto sm:w-1/2'>
        <div className="p-4 bg-c md:px-20 lg:px-32 xl:px-48">
          {currentUser && (
            <p className="mb-1 text-xl italic text-center text-b2 md:text-2xl">
              Bienvenido, <strong>{currentUser.displayName}</strong>
            </p>
          )}

          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Las más populares</h2>
            <Slider {...sliderSettings}>
              {popularCafes.map((cafe, index) => (
                <CoffeeCard key={index} cafe={cafe} />
              ))}
            </Slider>
          </div>

          <AdBanner />

          <div>
            <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Tus Favoritas</h2>
            <Slider {...sliderSettings}>
              {cafes.map((cafe, index) => (
                <CoffeeCard key={index} cafe={cafe} />
              ))}
            </Slider>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Cerca Tuyo</h2>
            <Slider {...sliderSettings}>
              {cafes.map((cafe, index) => (
                <CoffeeCard key={index} cafe={cafe} />
              ))}
            </Slider>
          </div>

          <div className='mb-24'>
            <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Nuevas Apariciones</h2>
            <Slider {...sliderSettings}>
              {cafes.map((cafe, index) => (
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
