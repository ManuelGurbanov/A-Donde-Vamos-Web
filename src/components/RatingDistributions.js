import React from 'react';
import fullStarDark from '../img/fullStar.png';
const RatingDistribution = ({ reviews }) => {
  // Array para contar las calificaciones: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
  const ratingsCount = new Array(11).fill(0);
  let totalRatings = 0;
  let totalReviews = 0;

  reviews.forEach(cafe => {
    cafe.reviews.forEach(review => {
      const rating = review.rating; // Obtener la calificación
      if (rating >= 0 && rating <= 5) {
        const index = rating * 2; // Multiplicamos por 2 para obtener el índice correspondiente
        ratingsCount[Math.floor(index)]++; // Incrementa el conteo
        totalRatings += rating;
        totalReviews++;
      }
    });
  });

  const averageRating = totalReviews ? (totalRatings / totalReviews).toFixed(1) : 0;

  return (
    <div className="p-1 rounded-lg flex w-3/4">
      <div className="flex w-2/3 gap-0 items-center justify-center">

      <div className='flex flex-col justify-end w-full h-full'>
      <img src={fullStarDark} alt="Estrella" className="w-5 h-4 mb-4"/>
      </div>


        {ratingsCount.map((count, index) => (
          <div key={index} className="flex flex-col items-center w-full overflow-hidden m-0">
            <div className="relative overflow-hidden flex items-end w-5/6 ring-black" style={{ height: '10vh' }}>
              <div
                className="w-full bg-c hover:bg-opacity-40"
                style={{
                  height: `${(totalReviews ? (count / totalReviews) * 100 : 0)}%`,
                  transition: 'height 0.3s ease'
                }}
              />
            </div>
            <span className="text-xs text-gray-600 opacity-0 hover:opacity-100">{(index / 2).toFixed(1)}</span>
          </div>
        ))}
      </div>
      <div className='flex flex-col justify-end w-full h-full'>
        <h1 className='w-full h-full text-center text-c text-4xl mt-7'>{averageRating}</h1>
      </div>
    </div>
  );
};

export default RatingDistribution;
