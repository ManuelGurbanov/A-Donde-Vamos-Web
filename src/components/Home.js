import React, { useContext, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../contexts/AuthContext';
import CoffeeCard from './CoffeeCard';
import Top from './Top';
import { CafeContext } from './CafeContext';
import loadingLogo from '../img/loading_logo.png';
import './styles.css'; // Import the CSS file

import AdSenseComponent from './AdSenseComponent';

const Home = () => {
  const { cafes, loading, error } = useContext(CafeContext);
  const { currentUser } = useAuth();

  const [selectedNeighs, setSelectedNeighs] = useState([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const isLargeScreen = window.innerWidth >= 1024;

  const [currentSlidePopular, setCurrentSlidePopular] = useState(0);
  const [currentSlideFavorites, setCurrentSlideFavorites] = useState(0);
  const [currentSlideNearby, setCurrentSlideNearby] = useState(0);
  const [currentSlideNew, setCurrentSlideNew] = useState(0);

  useEffect(() => {
    const storedNeighs = JSON.parse(localStorage.getItem('preferredNeighs'));
    if (storedNeighs && storedNeighs.length > 0) {
      setSelectedNeighs(storedNeighs);
    } else {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    // Cuando loading cambia, maneja fadeOut
    if (loading) {
      setFadeOut(false); // No hacer fadeOut cuando se está cargando
    } else {
      // Si ha terminado de cargar, iniciamos fadeOut
      setFadeOut(true);
      const fadeOutTimeout = setTimeout(() => {
        setFadeOut(false); // Reiniciar fadeOut para futuras cargas
      }, 1000); // Duración del fade-out

      return () => clearTimeout(fadeOutTimeout);
    }
  }, [loading]);

  const handleSavePreferences = () => {
    localStorage.setItem('preferredNeighs', JSON.stringify(selectedNeighs));
    setShowWelcome(false);
  };

  const handleFilterChange = (neigh) => {
    if (selectedNeighs.includes(neigh)) {
      setSelectedNeighs(selectedNeighs.filter(n => n !== neigh));
    } else {
      setSelectedNeighs([...selectedNeighs, neigh]);
    }
  };

  const uniqueNeighs = [...new Set(cafes.map(cafe => cafe.neigh))];

  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const sortedByRatings = [...cafes].sort((a, b) => (b.numRatings || 0) - (a.numRatings || 0));
  const popularCafes = sortedByRatings.slice(0, 5);

  const sortedByDate = [...cafes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const newCafes = sortedByDate.slice(0, 5);


  const sliderSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const sliderSettingsMove = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    beforeChange: (current, next) => setCurrentSlidePopular(next),
  };

// Generar listas únicas para cada slider
const uniquePopularCafes = sortedByRatings.slice(0, 5);

const remainingCafesAfterPopular = cafes.filter(
  (cafe) => !uniquePopularCafes.includes(cafe)
);

const uniqueFavoritesCafes = remainingCafesAfterPopular.slice(0, 5);

const remainingCafesAfterFavorites = remainingCafesAfterPopular.filter(
  (cafe) => !uniqueFavoritesCafes.includes(cafe)
);

const uniqueNewCafes = remainingCafesAfterFavorites.slice(0, 5);

const remainingCafesAfterNew = remainingCafesAfterFavorites.filter(
  (cafe) => !uniqueNewCafes.includes(cafe)
);

const nearbyCafes = selectedNeighs.length > 0
  ? remainingCafesAfterNew.filter(cafe => selectedNeighs.includes(cafe.neigh))
  : remainingCafesAfterNew;


  const handleNext = (cafesArray, setCurrentSlide, currentSlide) => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % cafesArray.length);
  };

  const handlePrev = (cafesArray, setCurrentSlide, currentSlide) => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + cafesArray.length) % cafesArray.length);
  };

  const renderCarousel = (cafesArray, currentSlide, setCurrentSlide) => {
    const currentCafe = cafesArray[currentSlide];

    if (!currentCafe) {
      return <div className="text-center text-red-600">No hay cafeterías disponibles.</div>;
    }

    return (
      <div className="relative flex items-center justify-center h-56 w-full">
        <button 
          onClick={() => handlePrev(cafesArray, setCurrentSlide, currentSlide)}
          className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-800 bg-opacity-20"
        >
          {'<'}
        </button>

        <div className="flex flex-col justify-center w-2/3 mx-4 h-80">
          <CoffeeCard cafe={currentCafe} />
        </div>

        <button 
          onClick={() => handleNext(cafesArray, setCurrentSlide, currentSlide)}
          className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-800 bg-opacity-20"
        >
          {'>'}
        </button>
      </div>
    );
  };


  return (
    <>
      <Top />

      {/* Controla la visibilidad y eventos del loadingDiv */}
      <div 
  id="loadingDiv" 
  className={`fixed top-0 left-0 z-30 flex items-center justify-center w-full h-full bg-b1 transition-opacity duration-1000 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none -z-50'}`}
  style={{ pointerEvents: 'none' }} // Evitar la interacción con los clics
>
  <img src={loadingLogo} className='w-full p-5 m-auto sm:w-80' alt="Loading..." />
</div>

{/* Mostrar el contenido solo si loading es false y fadeOut es false */}
{!loading && (
  <div>
    <div className='m-auto sm:w-screen sm:p-6'>
    {/* <AdSenseComponent/> */}
      {/* {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-3/4 p-4 bg-white rounded-lg sm:w-1/4">
            <h1 className="w-full p-4 text-2xl font-bold text-left text-c1">Bienvenido, elegí tus barrios de preferencia:</h1>
            <div className="text-center">
              {uniqueNeighs.map((neigh, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterChange(neigh)}
                  className={`p-1 m-1 rounded text-sm ${selectedNeighs.includes(neigh) ? 'bg-b2 text-c' : 'bg-gray-200 text-b1'}`}
                >
                  {neigh}
                </button>
              ))}
            </div>
            <div className='flex flex-col items-center justify-center w-full p-4'>
              <button
                onClick={() => handleSavePreferences()}
                className="w-full h-12 p-1 m-2 text-white rounded-lg bg-b1 hover:bg-b2"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )} */}

            <div className="p-4">
              <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
                <div className="mb-1">
                  <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Las más populares</h2>
                  {isLargeScreen ? (
                    renderCarousel(popularCafes, currentSlidePopular, setCurrentSlidePopular)
                  ) : (
                    <Slider {...sliderSettingsMove}>
                      {uniquePopularCafes.map((cafe, index) => (
                        <CoffeeCard key={index} cafe={cafe} />
                      ))}
                    </Slider>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Favoritas</h2>
                  {isLargeScreen ? (
                    renderCarousel(uniqueFavoritesCafes, currentSlideFavorites, setCurrentSlideFavorites)
                  ) : (
                    <Slider {...sliderSettings}>
                      {uniqueFavoritesCafes.map((cafe, index) => (
                        <CoffeeCard key={index} cafe={cafe} />
                      ))}
                    </Slider>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Cafeterías Cercanas</h2>
                  {isLargeScreen ? (
                    renderCarousel(nearbyCafes, currentSlideNearby, setCurrentSlideNearby)
                  ) : (
                    <Slider {...sliderSettings}>
                      {nearbyCafes.map((cafe, index) => (
                        <CoffeeCard key={index} cafe={cafe} />
                      ))}
                    </Slider>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Nuevas Cafeterías</h2>
                  {isLargeScreen ? (
                    renderCarousel(newCafes, currentSlideNew, setCurrentSlideNew)
                  ) : (
                    <Slider {...sliderSettings}>
                      {uniqueNewCafes.map((cafe, index) => (
                        <CoffeeCard key={index} cafe={cafe} />
                      ))}
                    </Slider>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
