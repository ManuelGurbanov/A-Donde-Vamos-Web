import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import outsideIcon from '../img/outside.png';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import fullStarWhite from '../img/fullStar.png';
import halfStarWhite from '../img/halfStar.png';
import emptyStarWhite from '../img/emptyStar.png';

const CoffeeCard = ({ cafe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [textColor, setTextColor] = useState('text-red-500');

  useEffect(() => {
    if (cafe && cafe.schedules) {
      checkIfOpen(cafe);
    }
  }, [cafe]);

  const calculateAverageRating = () => {
    if (!cafe.numRatings || cafe.numRatings === 0) return 0;
    return (cafe.totalRatings / cafe.numRatings).toFixed(1);
  };

  const checkIfOpen = (data) => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 100 + minutes;

    let schedule;
    if (day >= 1 && day <= 5) {
      schedule = data.schedules['lunes-viernes'];
    } else if (day === 6) {
      schedule = data.schedules.sabado;
    } else {
      schedule = data.schedules.domingo;
    }

    if (schedule) {
      const closingTime = schedule.cierre;
      const closingHours = Math.floor(closingTime / 100);
      const closingMinutes = closingTime % 100;
      const closingDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), closingHours, closingMinutes);

      const oneHourInMillis = 60 * 60 * 1000;
      const timeUntilClose = closingDate - now;

      if (schedule.apertura <= currentTime && currentTime <= schedule.cierre) {
        if (timeUntilClose <= oneHourInMillis) {
          setStatus('Próximo a cerrar');
          setTextColor('text-yellow-500'); // Color para "Próximo a cerrar"
        } else {
          setStatus('Abierto');
          setTextColor('text-green-500');
        }
        setIsOpen(true);
      } else {
        setStatus('Cerrado');
        setTextColor('text-red-500');
        setIsOpen(false);
      }
    } else {
      setStatus('Cerrado');
      setTextColor('text-red-500');
      setIsOpen(false);
    }
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

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 bg-b1 bg-opacity-90 h-1/2 hover:bg-opacity-100">
            <div>
              <h2 className="text-xl font-bold text-c2">{cafe.name || 'Nombre no disponible'}</h2>
              <p className="text-xs font-regular text-c2">{cafe.adress || 'Dirección no disponible'}, {cafe.neigh || 'Barrio no disponible'}</p>

              <div className="flex items-center space-x-1">
                {starRating(calculateAverageRating())}
                <span className="text-sm font-medium text-c2">{cafe.numRatings} valoraciones</span>
              </div>

              <p className={`text-sm ${textColor} font-bold italic`}>
                {status}
              </p>
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
