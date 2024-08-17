import React, { useState } from 'react';
import halfStarLeft from '../img/halfStarLeft.png';
import halfStarRight from '../img/halfStarRight.png';
import emptyStarLeft from '../img/emptyStarLeft.png'; // Imagen de la mitad vacía izquierda
import emptyStarRight from '../img/emptyStarRight.png'; // Imagen de la mitad vacía derecha

const StarRating = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (index, isHalf) => {
    const newRating = isHalf ? index + 0.5 : index + 1;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const renderStars = () => {
    const stars = [];
    const totalStars = 5;

    for (let i = 0; i < totalStars; i++) {
      const isLeftHalfFilled = rating > i && rating <= i + 0.5;
      const isRightHalfFilled = rating > i + 0.5 && rating < i + 1;
      const isFullStar = rating >= i + 1;

      stars.push(
        <div key={i} className="flex h-8 w-9">
          <img
            src={
              isFullStar || isLeftHalfFilled ? halfStarLeft : emptyStarLeft
            }
            alt="Star Left Half"
            className="w-1/2 h-full cursor-pointer"
            onClick={() => handleClick(i, true)}
          />
          <img
            src={
              isFullStar || isRightHalfFilled ? halfStarRight : emptyStarRight
            }
            alt="Star Right Half"
            className="w-1/2 h-full cursor-pointer"
            onClick={() => handleClick(i, false)}
          />
        </div>
      );
    }

    return stars;
  };

  return (
    <div className="flex mb-4">
      {renderStars()}
    </div>
  );
};

export default StarRating;
