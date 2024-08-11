import React from 'react';
import { Link } from 'react-router-dom';
import outsideIcon from '../img/outside.png';
import petIcon from '../img/pet.png';
import tacIcon from '../img/tac.png';
import veganIcon from '../img/vegan.png';

const CoffeeCard = ({ cafe }) => {
  return (
    <div className="p-2">
      <Link to={`/cafe/${cafe.id}`}>
        <div className="relative h-40 overflow-hidden bg-white rounded-lg shadow-md">
          <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" />
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-50">
            <h2 className="text-lg font-semibold text-white">{cafe.name || 'Nombre no disponible'}</h2>
            <p className="text-sm font-semibold text-gray-300">{cafe.neigh || 'Barrio no disponible'}</p>
            <p className="text-sm text-gray-300">{cafe.adress || 'Dirección no disponible'}</p>
            <div className="flex mt-2 space-x-2">
              {cafe.outside && <img src={outsideIcon} alt="Outside" className="w-6 h-6" />}
              {cafe.pet && <img src={petIcon} alt="Pet Friendly" className="w-6 h-6" />}
              {cafe.tac && <img src={tacIcon} alt="Take Away Cup" className="w-6 h-6" />}
              {cafe.vegan && <img src={veganIcon} alt="Vegan Options" className="w-6 h-6" />}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CoffeeCard;
