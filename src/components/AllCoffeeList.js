import React, { useState, useEffect, useContext } from 'react';
import { CafeContext } from './CafeContext';
import CoffeeCard from './CoffeeCard';
import Top from './Top';

import screen2 from '../img/screen2.png';

const AllCoffeeList = () => {
  const { cafes, loading, error } = useContext(CafeContext);
  const [filteredCafeterias, setFilteredCafeterias] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Actualizar la lista filtrada cada vez que cambien las cafeterías o el texto de búsqueda
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredCafeterias(
        [...cafes].sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente por nombre
      );
    } else {
      setFilteredCafeterias(
        cafes
          .filter(cafe =>
            cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cafe.neigh.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabéticamente por nombre después de filtrar
      );
    }
  }, [searchQuery, cafes]);
  

  if (loading) return <div className="mt-24 text-3xl text-center text-white">Cargando Cafeterías...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <>
      <Top text={"Todas las Cafeterías"}/>
      <div className="p-4 m-auto sm:w-3/4">
      <div className="mb-4 text-center">
          {/* Input de búsqueda con icono */}
          <div className="relative w-full m-auto sm:w-1/2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cafetería o barrio..."
              className="w-full p-2 pl-10 text-black border rounded-lg placeholder-c"
            />
            {/* Icono de búsqueda */}
            <img 
              src={screen2} 
              alt="Search Icon" 
              className="absolute w-5 h-5 transform -translate-y-1/2 top-1/2 left-3" 
            />
          </div>
        </div>

        {/* Lista de cafeterías filtradas */}
        <div className="grid grid-cols-1 gap-4 mb-16 md:grid-cols-2 lg:grid-cols-3">
          {filteredCafeterias.length > 0 ? (
            filteredCafeterias.map((cafe, index) => (
              <CoffeeCard key={index} cafe={cafe} />
            ))
          ) : (
            <div className="text-xl text-center text-gray-500 col-span-full">
              No se encontraron cafeterías
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllCoffeeList;
