import React, { useContext, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useAuth } from '../contexts/AuthContext';
import CoffeeCard from './CoffeeCard';
import { Link } from 'react-router-dom';
import { CafeContext } from './CafeContext';
import loadingLogo from '../img/loading_logo.png';
import searchLogo from '../img/screen2.png';
import './styles.css'; // Import the CSS file
import BouncingDotsLoader from './BouncingDotsLoader';

import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

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
    const storedNeighs = JSON.parse(localStorage.getItem('preferredNeighborhoods'));

    if (storedNeighs && storedNeighs.length > 0) {
        setSelectedNeighs(storedNeighs);
        console.log("Barrios preferidos recuperados", storedNeighs);
    } else {
        if (!storedNeighs) {
            setShowWelcome(true);
            console.log("Barrios preferidos no encontrados");
        }
    }
}, []);
  


  const handleSavePreferences = () => {
    localStorage.setItem('preferredNeighs', JSON.stringify(selectedNeighs));
    setShowWelcome(false);
  };

  const handleFilterChange = (neigh) => {
    let updatedNeighs;

    if (selectedNeighs.includes(neigh)) {
        updatedNeighs = selectedNeighs.filter((n) => n !== neigh);
    } else {
        updatedNeighs = [...selectedNeighs, neigh];
    }

    setSelectedNeighs(updatedNeighs);
    localStorage.setItem('preferredNeighborhoods', JSON.stringify(updatedNeighs));
    console.log("Barrios preferidos actualizados", updatedNeighs);
};

  const uniqueNeighs = [...new Set(cafes.map((cafe) => cafe.neigh))].sort((a, b) =>
    a.localeCompare(b)
  );

  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  const sortedByRatings = [...cafes].sort((a, b) => (b.numRatings || 0) - (a.numRatings || 0));
  const popularCafes = sortedByRatings.slice(0, 5);

  const sortedByDate = [...cafes].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const newCafes = sortedByDate.slice(0, 5);

  const remainingCafesAfterPopular = cafes.filter(
    (cafe) => !popularCafes.includes(cafe)
  );
  const uniqueFavoritesCafes = remainingCafesAfterPopular.slice(0, 5);

  const recomendedCafes = cafes.filter((cafe) => cafe.recomended);

  const remainingCafesAfterFavorites = remainingCafesAfterPopular.filter(
    (cafe) => !uniqueFavoritesCafes.includes(cafe)
  );

  const nearbyCafes = cafes.filter((cafe) => selectedNeighs.includes(cafe.neigh));

  const sliderSettings = {
    arrows: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const sliderSettingsMove = {
    ...sliderSettings,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    beforeChange: (_, next) => setCurrentSlidePopular(next),
  };

  const handleNext = (cafesArray, setCurrentSlide) => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % cafesArray.length);
  };

  const handlePrev = (cafesArray, setCurrentSlide) => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + cafesArray.length) % cafesArray.length);
  };

  const renderCarousel = (cafesArray, currentSlide, setCurrentSlide) => {
    const currentCafe = cafesArray[currentSlide];
    return currentCafe ? (
      <div className="relative flex items-center justify-center w-full h-56">
        <button
          onClick={() => handlePrev(cafesArray, setCurrentSlide)}
          className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-800 bg-opacity-20"
        >
          {'<'}
        </button>
        <div className="flex flex-col justify-center w-2/3 mx-4 h-80">
          <CoffeeCard cafe={currentCafe} />
        </div>
        <button
          onClick={() => handleNext(cafesArray, setCurrentSlide)}
          className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-800 bg-opacity-20"
        >
          {'>'}
        </button>
      </div>
    ) : (
      <div className="text-center text-red-600">No hay cafeterías disponibles.</div>
    );
  };

  
  return (
    <>
      <div
        id="loadingDiv"
        className={`fixed top-0 left-0 z-30 flex flex-col items-center justify-center w-full h-full bg-b1 transition-opacity duration-1000 ${
          loading ? 'opacity-100' : 'opacity-0 pointer-events-none -z-50'
        }`}
      >
        <img src="loading.gif" className="w-full p-5 sm:w-96" alt="Loading..." />
      </div>

{/* Mostrar el contenido solo si loading es false y fadeOut es false */}
{!loading && (
  <div>
    <div className='m-auto sm:w-screen sm:p-24 sm:py-7'>
    {/* <AdSenseComponent/> */}
    {showWelcome && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-4/5 p-4 bg-white rounded-lg sm:w-1/2">
          <h1 className="w-full p-4 text-2xl font-bold text-left text-c1">
            Recomendarme cafeterías en:
          </h1>
          <div className="overflow-y-scroll h-64 max-h-[80vw] flex flex-col items-center justify-start rounded-lg">
            {uniqueNeighs.map((neigh, index) => (
              <button
                key={index}
                onClick={() => handleFilterChange(neigh)}
                className={`p-2 m-2 rounded text-sm w-11/12 ${selectedNeighs.includes(neigh) ? 'bg-b2 text-c' : 'bg-gray-200 text-b1'}`}
              >
                {neigh}
              </button>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center w-full p-4">
            <button
              onClick={() => handleSavePreferences()}
              className="w-full h-12 p-1 m-2 rounded-lg text-c bg-b1 hover:bg-c hover:text-b1"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )}

<div>
    </div>




            <div className="px-4 mb-32">
              <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
                
              <div>
                <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Cerca Tuyo</h2>
                  {isLargeScreen ? (
                    <>
                    {renderCarousel(nearbyCafes, currentSlideNearby, setCurrentSlideNearby)}
                    </>
                  ) : (
                    <>
                    <Slider {...sliderSettings}>
                      {nearbyCafes.map((cafe, index) => (
                        <CoffeeCard key={index} cafe={cafe} />
                      ))}
                    </Slider>

                    <div className='flex items-center justify-center w-full'>
                      <button
                        type="button"
                        onClick={() => setShowWelcome(true)}
                        className="w-5/6 p-1 py-2 mb-2 text-xs font-bold text-center border cursor-pointer rounded-2xl bg-c text-b1 bg-opacity-90"
                      >
                        Cambiar Barrios para Recomendaciones
                      </button>
                    </div>
                    </>
                  )}
                </div> 
                <div className="mb-1">
                  <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Las más populares</h2>
                  {isLargeScreen ? (
                    renderCarousel(popularCafes, currentSlidePopular, setCurrentSlidePopular)
                  ) : (
                   <Slider {...sliderSettingsMove}>
                      {popularCafes.map((cafe, index) => (
                        <CoffeeCard key={index} cafe={cafe} />
                      ))}
                    </Slider>
                  )}
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-left text-c2 md:text-3xl">Recomendaciones</h2>
                  {isLargeScreen ? (
                    renderCarousel(recomendedCafes, currentSlideFavorites, setCurrentSlideFavorites)
                  ) : (
                    <Slider {...sliderSettings}>
                      {recomendedCafes.map((cafe, index) => (
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
                      {newCafes.map((cafe, index) => (
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
