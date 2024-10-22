import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import outsideIcon from '../img/outside.webp';
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
    const today = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const currentTime = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`; // Hora actual en formato "HHMM"
    const francos = data.francos ? data.francos.split(',').map(Number) : [];
    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayKey = daysOfWeek[today];

    console.log("Día actual:", dayKey);
    console.log("Hora actual:", currentTime);
    console.log("Días francos:", francos);

    // Obtener el horario de apertura y cierre para el día actual
    const getScheduleForToday = () => {
        console.log("Verificando si hay horario específico para hoy:", dayKey);

        // Verifica si 'data.schedules' y 'data.schedules.dias' existen
        if (data.schedules && data.schedules.dias) {
            // Comprobar si existe un horario específico para hoy
            if (data.schedules.dias[dayKey]) {
                console.log(`Horario específico para ${dayKey}:`, data.schedules.dias[dayKey]);
                return data.schedules.dias[dayKey]; // Retornar el horario específico
            }
        }

        // Si es de lunes a viernes sin horario específico, usar horario de lunes a viernes
        if (today >= 1 && today <= 5 && data.schedules && data.schedules.lunes_viernes) {
            console.log("No hay horario específico, usando horario de lunes a viernes:", data.schedules.lunes_viernes);
            return data.schedules.lunes_viernes; // Retornar horario de lunes a viernes
        }
        
        // Si es sábado o domingo, usar horario del domingo
        if (data.schedules && data.schedules.domingo) {
            console.log("Usando horario de domingo:", data.schedules.domingo);
            return data.schedules.domingo; // Retornar horario del domingo
        }

        // Si no hay horario definido, retorna null
        return null;
    };

    // Verificar si hoy es un día franco
    if (francos.includes(today)) {
        console.log("Hoy es un día franco.");
        setStatus('Cerrado');
        setTextColor('text-red-500');
        setIsOpen(false);
        return;
    }

    // Obtener horario de hoy
    const schedule = getScheduleForToday();

    if (!schedule || !schedule.apertura || !schedule.cierre) {
        console.log("No hay horario definido para hoy.");
        setStatus('Horario no disponible');
        setTextColor('text-red-500');
        setIsOpen(false);
        return;
    }

    // Comparar la hora actual con los horarios de apertura y cierre
    const openingTime = schedule.apertura;
    const closingTime = schedule.cierre;

    console.log("Horario de apertura:", openingTime);
    console.log("Horario de cierre:", closingTime);

    if (currentTime >= openingTime && currentTime < closingTime) {
        // Está abierto
        setStatus('Abierto');
        setTextColor('text-c2');
        setIsOpen(true);
    } else {
        // Está cerrado
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

  return (
    <div className="p-2">
      <Link to={`/cafe/${cafe.id}`}>
        <div className="relative overflow-hidden bg-white rounded-lg shadow-md h-[143px]">
          <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" />
  
          {/* Contenedor padre que tiene position relative */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between h-20 p-2 bg-b1 bg-opacity-95 hover:bg-opacity-100">
            
            {/* Contenedor de los textos con position relative */}
            <div className="relative w-full h-full"> {/* Aquí solo va relative */}
              <h2 className="absolute top-[-5px] left-2 text-xl font-bold text-c2">{cafe.name || 'Nombre no disponible'}</h2>
  
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


  
              {/* Texto status con posicionamiento absoluto dentro del div relativo */}
              <p className={`absolute top-12 left-2 text-xs ${textColor} font-bold italic`}>
                {status}
              </p>
            </div>
  
            {/* Iconos */}
            <div className="flex flex-col max-h-full gap-1">
              {cafe.vegan && <img src={veganIcon} alt="Vegan Options" className="w-5 h-5" />}
              {cafe.tac && <img src={tacIcon} alt="Take Away Cup" className="w-5 h-5" />}
              {cafe.pet && <img src={petIcon} alt="Pet Friendly" className="w-5 h-5" />}
              {/* {cafe.outside && <img src={outsideIcon} alt="Outside" className="w-5 h-5" />} */}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
  
  
};

export default CoffeeCard;