import React from 'react';
import fullStarDark from '../img/fullStar.png';
import halfStarDark from '../img/halfStar.png';
import emptyStarDark from '../img/emptyStar.png';

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
  
  const calculateAverageRating = () => {
    if (averageRating === 0) return 0;
    return (averageRating / totalRatings).toFixed(1);
  };

  return (
    <div className="p-1 rounded-lg flex w-3/4">
      <div className="flex w-2/3 gap-0 items-end justify-center">

      <div className='flex flex-col justify-end items-end w-full h-full'>
      <img src={fullStarDark} alt="Estrella" className="w-5 h-5"/>
      </div>


        {ratingsCount.map((count, index) => (
          <div key={index} className="flex flex-col items-center w-6 overflow-hidden m-0 mr-1">
            <div className="relative overflow-hidden flex items-end w-full ring-black" style={{ height: '10vh' }}>
              <div
                className="w-full bg-c hover:bg-opacity-40"
                style={{
                  height: `${(totalReviews ? (count / totalReviews) * 100 : 0)}%`,
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
  );
};

export default RatingDistribution;
