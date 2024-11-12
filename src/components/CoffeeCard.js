import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import outsideIcon from '../img/outside.webp';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

import fullStarWhite from '../img/fullStar.png';
import halfStarWhite from '../img/halfStar.png';
import emptyStarWhite from '../img/emptyStar.png';
import slugify from 'slugify';

const CoffeeCard = ({ cafe }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');


  useEffect(() => {
    if (cafe && cafe.schedules) {
      checkIfOpen(cafe);
    }
  }, [cafe]);

  const calculateAverageRating = () => {
    if (!cafe.numRatings || cafe.numRatings === 0) return 0;
    return (cafe.totalRatings / cafe.numRatings).toFixed(1);
  };

  const checkIfOpen = (schedules) => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const currentTimeInMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const currentDayName = dayNames[currentDay];
    const previousDayName = dayNames[(currentDay - 1 + 7) % 7];

    const todaySchedule = schedules[currentDayName];
    const previousDaySchedule = schedules[previousDayName];

    // Verificar si el día anterior tenía un horario extendido (cierre después de medianoche)
    if (previousDaySchedule && !previousDaySchedule.cerrado) {
        const previousDayOpeningTime = parseTime(previousDaySchedule.apertura);
        let previousDayClosingTime = parseTime(previousDaySchedule.cierre);

        if (previousDayClosingTime < previousDayOpeningTime) {
            previousDayClosingTime += 1440; // Extender cierre al siguiente día
        }
        const minutesSincePreviousDayStart = 1440 + currentTimeInMinutes;

        if (minutesSincePreviousDayStart < previousDayClosingTime) {
            return 'abierto';
        }
    }

    // Si no estamos en el horario extendido, verificar el horario del día actual
    if (!todaySchedule || todaySchedule.cerrado) {
        return 'cerrado';
    }

    const openingTime = parseTime(todaySchedule.apertura);
    let closingTime = parseTime(todaySchedule.cierre);

    // Ajustar si el cierre ocurre después de medianoche
    if (closingTime < openingTime) {
        closingTime += 1440; // Extiende el cierre al día siguiente
    }

    // Verificar si la hora actual está dentro del rango de apertura de hoy
    if (currentTimeInMinutes >= openingTime && currentTimeInMinutes < closingTime) {
        return 'abierto';
    }

    return 'cerrado';
};



const parseTime = (timeString) => {
  const hours = parseInt(timeString.slice(0, 2), 10);
  const minutes = parseInt(timeString.slice(2, 4), 10);
  return hours * 60 + minutes; // Devuelve el total en minutos
};


const textColor = status === 'abierto' ? 'text-green-500' : 'text-red-500';





  const starRating = (rating) => {
    const stars = [];
    const totalStars = 5;

    const fullStarsCount = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStarsCount = totalStars - fullStarsCount - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStarsCount; i++) {
      stars.push(<img key={`full-${i}`} src={fullStarWhite} alt="Full Star" className="inline-block w-2 h-2" />);
    }

    if (hasHalfStar) {
      stars.push(<img key="half" src={halfStarWhite} alt="Half Star" className="inline-block w-2 h-2" />);
    }

    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(<img key={`empty-${i}`} src={emptyStarWhite} alt="Empty Star" className="inline-block w-2 h-2" />);
    }

    return stars;
  };


  const slug = slugify(cafe.name || '', { lower: true, strict: true });

  return (
    <div className="p-2">
      <Link to={`/cafe/${slug}`}>
        <div className="relative overflow-hidden bg-white rounded-lg shadow-md h-[143px] sm:h-[200px]">
          <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" />
  
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between h-20 p-2 bg-b1 bg-opacity-95 hover:bg-opacity-100">
            
            <div className="relative w-full h-full">
              <h2 className="absolute top-[-5px] left-2 text-xl font-bold text-c2 text-nowrap text-ellipsis">{cafe.name || 'Nombre no disponible'}</h2>
  
              <p className="absolute text-xs left-2 top-5 font-regular text-c2">{cafe.adress || 'Dirección no disponible'}, {cafe.neigh || 'Barrio no disponible'}</p>
  
              <div className="absolute flex items-center mt-1 space-x-1 left-2 top-8">
                {starRating(calculateAverageRating())}
                <span className="text-[8px] font-medium text-c2">
                  {typeof cafe.numRatings === 'undefined'
                    ? "Sin valoraciones"
                    : cafe.numRatings === 1
                    ? `${cafe.numRatings} valoración`
                    : `${cafe.numRatings} valoraciones`}
                </span>
              </div>


              <p className={`absolute top-12 left-2 text-xs ${checkIfOpen(cafe.schedules) === 'abierto' ? 'text-c2' : 'text-red-500'} font-bold italic`}>
                {checkIfOpen(cafe.schedules)}
              </p>

            </div>
  
            <div className="flex flex-col max-h-full gap-1">
              {cafe.vegan && <img src={veganIcon} alt="Vegan Options" className="w-5 h-5" />}
              {cafe.tac && <img src={tacIcon} alt="Take Away Cup" className="w-5 h-5" />}
              {cafe.pet && <img src={petIcon} alt="Pet Friendly" className="w-5 h-5" />}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
  
  
};

export default CoffeeCard;