import React from 'react';
import { Link } from 'react-router-dom';
import outsideIcon from '../img/outside.png';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import fullStar from '../img/fullStar.png';
import halfStar from '../img/halfStar.png';
import emptyStar from '../img/emptyStar.png';

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
      stars.push(<img key={`full-${i}`} src={fullStar} alt="Full Star" className="inline-block w-6 h-6" />);
    }

    if (hasHalfStar) {
      stars.push(<img key="half" src={halfStar} alt="Half Star" className="inline-block w-6 h-6" />);
    }

    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<img key={`empty-${i}`} src={emptyStar} alt="Empty Star" className="inline-block w-6 h-6" />);
    }

    return stars;
  };

  return (
    <div className="p-2">
      <Link to={`/cafe/${cafe.id}`}>
        <div className="relative h-40 overflow-hidden bg-white rounded-lg shadow-md">
          {/* <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" /> */}

          <div className="absolute inset-0 flex flex-col justify-start p-4 bg-white bg-opacity-100 items-left">
            <h2 className="text-2xl font-bold text-c2">{cafe.name || 'Nombre no disponible'}</h2>
            <p className="text-base font-medium text-c2">{cafe.adress || 'Dirección no disponible'}, {cafe.neigh || 'Barrio no disponible'}</p>

            <div className="flex mt-1 space-x-1">
              {starRating(calculateAverageRating())}
            </div>

            <div className="flex mt-1 space-x-2">
              {cafe.vegan && <img src={veganIcon} alt="Vegan Options" className="w-4 h-4" />}
              {cafe.tac && <img src={tacIcon} alt="Take Away Cup" className="w-4 h-4" />}
              {cafe.pet && <img src={petIcon} alt="Pet Friendly" className="w-4 h-4" />}
              {cafe.outside && <img src={outsideIcon} alt="Outside" className="w-4 h-4" />}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CoffeeCard;
