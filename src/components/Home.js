import React, { useContext, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../contexts/AuthContext';
import CoffeeCard from './CoffeeCard';
import Top from './Top';
import { CafeContext } from './CafeContext';

const Home = () => {
  const { cafes, loading, error } = useContext(CafeContext);
  const { currentUser } = useAuth();

  const isLargeScreen = window.innerWidth >= 1024;

  // Estados separados para cada carrusel
  const [currentSlidePopular, setCurrentSlidePopular] = useState(0);
  const [currentSlideFavorites, setCurrentSlideFavorites] = useState(0);
  const [currentSlideNearby, setCurrentSlideNearby] = useState(0);
  const [currentSlideNew, setCurrentSlideNew] = useState(0);

  if (loading) return <div className="mt-24 text-3xl text-center text-white">Cargando Cafeterías...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  // Ordenar cafeterías por número de reseñas
  const sortedByRatings = [...cafes].sort((a, b) => (b.numRatings || 0) - (a.numRatings || 0));
  const popularCafes = sortedByRatings.slice(0, 5);

  // Ordenar cafeterías por fecha
  const sortedByDate = [...cafes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const newCafes = sortedByDate.slice(0, 5);

  const sliderSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleNext = (cafesArray, setCurrentSlide, currentSlide) => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % cafesArray.length);
  };

  const handlePrev = (cafesArray, setCurrentSlide, currentSlide) => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + cafesArray.length) % cafesArray.length);
  };

  const renderCarousel = (cafesArray, currentSlide, setCurrentSlide) => (
    <div className="relative flex items-center justify-center h-56">
      <button 
        onClick={() => handlePrev(cafesArray, setCurrentSlide, currentSlide)}
        className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-800 bg-opacity-20"
      >
        {'<'}
      </button>

      <div className="flex flex-col justify-center w-2/3 mx-4 h-80">
        <CoffeeCard cafe={cafesArray[currentSlide]} />
      </div>

      <button 
        onClick={() => handleNext(cafesArray, setCurrentSlide, currentSlide)}
        className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-800 bg-opacity-20"
      >
        {'>'}
      </button>
    </div>
  );

  return (
    <>
      <Top />

      <div className='m-auto sm:w-3/4'>
        <div className="p-4">
          {currentUser && (
            <p className="mb-1 text-xl italic text-center text-b2 md:text-2xl">
              Bienvenido, <strong>{currentUser.displayName}</strong>
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="mb-1">
              <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Las más populares</h2>
              {isLargeScreen ? (
                renderCarousel(popularCafes, currentSlidePopular, setCurrentSlidePopular)
              ) : (
                <Slider {...sliderSettings}>
                  {popularCafes.map((cafe, index) => (
                    <CoffeeCard key={index} cafe={cafe} />
                  ))}
                </Slider>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Tus Favoritas</h2>
              {isLargeScreen ? (
                renderCarousel(cafes, currentSlideFavorites, setCurrentSlideFavorites)
              ) : (
                <Slider {...sliderSettings}>
                  {cafes.map((cafe, index) => (
                    <CoffeeCard key={index} cafe={cafe} />
                  ))}
                </Slider>
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Cerca Tuyo</h2>
              {isLargeScreen ? (
                renderCarousel(cafes, currentSlideNearby, setCurrentSlideNearby)
              ) : (
                <Slider {...sliderSettings}>
                  {cafes.map((cafe, index) => (
                    <CoffeeCard key={index} cafe={cafe} />
                  ))}
                </Slider>
              )}
            </div>

            <div className='mb-24'>
              <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Nuevas Apariciones</h2>
              {isLargeScreen ? (
                renderCarousel(newCafes, currentSlideNew, setCurrentSlideNew)
              ) : (
                <Slider {...sliderSettings}>
                  {newCafes.map((cafe, index) => (
                    <CoffeeCard key={index} cafe={cafe} />
                  ))}
                </Slider>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
