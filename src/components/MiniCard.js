import React from 'react';
import { Link } from 'react-router-dom';

const MiniCard = ({ cafe, slug, newName }) => {

  const truncateName = (name, maxChars) => {
    if (!name) return 'Nombre no disponible';
    
    const words = name.split(' ');  // Separamos el nombre por palabras
    let truncated = '';
    
    for (const word of words) {
      if ((truncated + word).length <= maxChars) {
        truncated += `${word} `;  // Agregamos la palabra y un espacio
      } else {
        break;  // Rompemos el bucle si añadir otra palabra excede el límite de caracteres
      }
    }
  
    return truncated.trim();
  };

  return (
    <div className="p-0 w-24">
      <Link to={`/${slug}`}>
        <div className="overflow-hidden bg-b1 rounded-lg shadow-md flex flex-col items-center">
          <img
            src={cafe.picsLinks?.[0] || 'default-image.jpg'}
            alt={cafe.name}
            className="object-cover w-full h-[150px] rounded-t-lg"
          />

          <h2 className="mt-2 text-center text-xs font-bold text-c2 h-9 overflow-hidden text-ellipsis whitespace-nowrap truncate">
            {cafe.name || newName || 'Nombre no disponible'}
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default MiniCard;
