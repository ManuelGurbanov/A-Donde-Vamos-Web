import React from 'react';
import { Link } from 'react-router-dom';
import outsideIcon from '../img/outside.png';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import fullStarWhite from '../img/fullStarWhite.png';
import halfStarWhite from '../img/halfStarWhite.png';
import emptyStarWhite from '../img/emptyStarWhite.png';

const CoffeeCard = ({ cafe }) => {
  const calculateAverageRating = () => {
    if (cafe.numRatings === 0) return 0;
    return (cafe.totalRatings / cafe.numRatings).toFixed(1);
  };

  const starRating = (rating) => {
    const stars = [];
    const totalStars = 5;

    const fullStarsCount = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStarsCount = totalStars - fullStarsCount - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStarsCount; i++) {
      stars.push(<img key={`full-${i}`} src={fullStarWhite} alt="Full Star" className="inline-block w-3 h-3" />);
    }

    if (hasHalfStar) {
      stars.push(<img key="half" src={halfStarWhite} alt="Half Star" className="inline-block w-3 h-3" />);
    }

    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<img key={`empty-${i}`} src={emptyStarWhite} alt="Empty Star" className="inline-block w-3 h-3" />);
    }

    return stars;
  };

  return (
    <div className="p-2">
      <Link to={`/cafe/${cafe.id}`}>
        <div className="relative h-48 overflow-hidden bg-white rounded-lg shadow-md">
          <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 bg-c2 bg-opacity-90 h-1/2">
            <div>
              <h2 className="text-xl font-bold text-c">{cafe.name || 'Nombre no disponible'}</h2>
              <p className="text-xs font-regular text-c">{cafe.adress || 'Dirección no disponible'}, {cafe.neigh || 'Barrio no disponible'}</p>

              <div className="flex items-center space-x-1">
                {starRating(calculateAverageRating())}
                <span className="text-sm font-medium text-c">{cafe.numRatings} valoraciones</span>
              </div>
              <p className="text-xs font-medium text-white">Abierto</p>
            </div>

            <div className="flex flex-col max-h-full space-y-2">
              {cafe.vegan && <img src={veganIcon} alt="Vegan Options" className="w-5 h-5" />}
              {cafe.tac && <img src={tacIcon} alt="Take Away Cup" className="w-5 h-5" />}
              {cafe.pet && <img src={petIcon} alt="Pet Friendly" className="w-5 h-5" />}
              {cafe.outside && <img src={outsideIcon} alt="Outside" className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CoffeeCard;
