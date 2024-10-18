import React from 'react';
import { Link } from 'react-router-dom';

const MiniCard = ({ cafe }) => {
  return (
    <div className="p-2 max-w-[35vw]">
      <Link to={`/cafe/${cafe.id}`}>
        <div className="overflow-hidden bg-b1 rounded-lg shadow-md h-[200px] max-w-[150px] flex flex-col items-center">
          {/* Imagen de la cafetería */}
          <img
            src={cafe.picsLinks?.[0] || 'default-image.jpg'}
            alt={cafe.name}
            className="object-cover w-full h-[150px] rounded-t-lg"
          />

          {/* Nombre de la cafetería */}
          <h2 className="mt-2 text-center text-xs font-bold text-c2 h-9 overflow-hidden text-ellipsis whitespace-nowrap">
            {cafe.name || 'Nombre no disponible'}
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default MiniCard;
