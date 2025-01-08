import React, { useState } from 'react';
import fullStarDark from '../img/fullStar.png';
import halfStarDark from '../img/halfStar.png';
import emptyStarDark from '../img/emptyStar.png';

const RatingDistribution = ({ reviews }) => {
  const [showAchievements, setShowAchievements] = useState(false);

  const ratingsCount = new Array(11).fill(0);
  let totalRatings = 0;
  let totalReviews = 0;

  // Calcular estadísticas
  reviews.forEach(cafe => {
    cafe.reviews.forEach(review => {
      const rating = review.rating;
      if (rating >= 0 && rating <= 5) {
        const index = rating * 2;
        ratingsCount[Math.floor(index)]++;
        totalRatings += rating;
        totalReviews++;
      }
    });
  });

  const averageRating = totalReviews ? (totalRatings / totalReviews).toFixed(1) : 0;

  const achievements = [
    { 
      icon: '🥇', 
      name: 'Primera reseña', 
      description: '¡Hiciste tu primera reseña! 🥺 ¿Todo un logro, no? 🙌', 
      condition: () => totalReviews >= 1 
    },
    { 
      icon: '☕', 
      name: 'Aficionado', 
      description: 'Sólo reseñaste 10 cafeterías. 🥱 Falta ritmo.', 
      condition: () => totalReviews >= 10 
    },
    { 
      icon: '📸', 
      name: 'Influencer de cafeterías', 
      description: 'Reseñaste 20 cafeterías. (Recomendadas por tu influencer de confianza, obvio).', 
      condition: () => totalReviews >= 20 
    },
    { 
      icon: '🤓', 
      name: 'Obsesivo', 
      description: 'Reseñaste 30 cafeterías. Reconocelo, a esta altura te molesta que la gente endulce el café.', 
      condition: () => totalReviews >= 30 
    },
    { 
      icon: '🎓', 
      name: 'Maestro', 
      description: 'Reseñaste 40 cafeterías. ¡Te recibiste de Master en Café de especialidad!', 
      condition: () => totalReviews >= 40 
    },
    { 
      icon: '💻', 
      name: 'Workaholic', 
      description: 'Primera reseña de una cafetería que permite hacer coworking.', 
      condition: () => reviews.some(cafe => cafe.coworking) 
    },
    { 
      icon: '☕', 
      name: 'Cafés eran los de antes…', 
      description: 'Primera reseña de un café / Bar Notable.', 
      condition: () => reviews.some(cafe => cafe.cafeNotable) 
    },
    { 
      icon: '🌱', 
      name: 'A base de plantas', 
      description: 'Primera reseña de una cafetería con opción vegana.', 
      condition: () => reviews.some(cafe => cafe.vegan) 
    },
    { 
      icon: '🐶', 
      name: '¡Guau, Guau, Guau!', 
      description: 'Primera reseña de una cafetería que es Pet Friendly.', 
      condition: () => reviews.some(cafe => cafe.pet) 
    },
  ];

  // Función para determinar si un logro está completo
  const isAchievementComplete = (achievement) => achievement.condition();

  const starRating = (rating) => {
    const stars = [];
    const totalStars = 5;

    const fullStarsCount = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStarsCount = totalStars - fullStarsCount - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStarsCount; i++) {
      stars.push(<img key={`full-${i}`} src={fullStarDark} alt="Full Star" className="inline-block w-3 h-3" />);
    }

    if (hasHalfStar) {
      stars.push(<img key="half" src={halfStarDark} alt="Half Star" className="inline-block w-3 h-3" />);
    }

    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<img key={`empty-${i}`} src={emptyStarDark} alt="Empty Star" className="inline-block w-3 h-3" />);
    }

    return stars;
  };


  return (
    <>
    <div className="p-1 rounded-lg flex w-3/4 sm:w-1/4">
      <div className="flex w-2/3 gap-0 items-end justify-center">
        <div className="flex flex-col justify-end items-end w-full h-full">
          <img src={fullStarDark} alt="Estrella" className="w-5 h-5" />
        </div>

        {ratingsCount.map((count, index) => (
          <div key={index} className="flex flex-col items-center w-6 overflow-hidden m-0 mr-1">
            <div className="relative overflow-hidden flex items-end w-full ring-black" style={{ height: '10vh' }}>
              <div
                className="w-full bg-c hover:bg-opacity-40"
                style={{
                  height: `${totalReviews ? (count / totalReviews) * 100 : 0}%`,
                  transition: 'height 0.3s ease'
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className='flex flex-col justify-center items-center w-full h-full'>
        <h1 className='w-full h-full text-center text-c text-xl mt-7'>{averageRating}</h1>
        <p>{starRating(averageRating)}</p>
      </div>
    </div>
    <button className='w-64 bg-c text-b1 rounded-lg mt-4 px-4 py-1' onClick={() => setShowAchievements(true)}>Ver Logros</button>
    {/* Modal de Logros */}
    {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={() => setShowAchievements(false)}>
          <div className="bg-white rounded-lg p-6 w-3/4 sm:w-1/2 shadow-lg relative overflow-scroll h-2/3">
            <h2 className="text-center text-xl font-bold">Logros</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center p-2 rounded shadow ${
                    isAchievementComplete(achievement) ? 'bg-green-100' : 'bg-gray-100 opacity-50'
                  }`}
                >
                  <span className="text-3xl mr-3">{achievement.icon}</span>
                  <div>
                    <h3 className="font-bold">{achievement.name}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingDistribution;