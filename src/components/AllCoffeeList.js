import React, { useState, useEffect, useContext } from 'react';
import { CafeContext } from './CafeContext';
import CoffeeCard from './CoffeeCard';
import Top from './Top';

const AllCoffeeList = () => {
  const { cafes, loading, error } = useContext(CafeContext);
  const [filteredCafeterias, setFilteredCafeterias] = useState([]);
  const [selectedNeighs, setSelectedNeighs] = useState([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    setFilteredCafeterias(cafes);
  }, [cafes]);

  useEffect(() => {
    if (selectedNeighs.length === 0) {
      setFilteredCafeterias(cafes);
    } else {
      setFilteredCafeterias(cafes.filter(cafe => selectedNeighs.includes(cafe.neigh)));
    }
  }, [selectedNeighs, cafes]);

  const uniqueNeighs = [...new Set(cafes.map(cafe => cafe.neigh))];

  const handleFilterChange = (neigh) => {
    if (selectedNeighs.includes(neigh)) {
      setSelectedNeighs(selectedNeighs.filter(n => n !== neigh));
    } else {
      setSelectedNeighs([...selectedNeighs, neigh]);
    }
  };

  if (loading) return <div className="mt-24 text-3xl text-center text-white">Cargando Cafeterías...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <>
      <Top />
      <div className="p-4">
        <div className="mb-4 text-center">
          <button
            onClick={() => setIsFilterPanelOpen(true)}
            className="p-2 m-1 text-white rounded bg-c1 hover:bg-c2"
          >
            Filtrar por Barrio
          </button>
        </div>

        {isFilterPanelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-4 bg-white rounded-lg sm:w-1/4">
              <h1 className="w-full p-4 text-2xl font-bold text-left text-c1">Aplicar Filtros</h1>
              <div className="text-center">
                {uniqueNeighs.map((neigh, index) => (
                  <button
                    key={index}
                    onClick={() => handleFilterChange(neigh)}
                    className={`p-2 m-2 rounded ${selectedNeighs.includes(neigh) ? 'bg-b2 text-b1' : 'bg-gray-200 text-b1'}`}
                  >
                    {neigh}
                  </button>
                ))}
              </div>
              <div className='flex flex-col items-center justify-center w-full p-4'>
                <button
                  onClick={() => setSelectedNeighs([])}
                  className="w-full h-12 p-1 m-2 text-white rounded-xl bg-b1 hover:bg-b2"
                >
                  Borrar todos los filtros
                </button>
                <button
                  onClick={() => setIsFilterPanelOpen(false)}
                  className="w-full h-12 p-1 m-2 text-white rounded-lg bg-b1 hover:bg-b2"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mb-16 md:grid-cols-2 lg:grid-cols-3">
          {filteredCafeterias.map((cafe, index) => (
            <CoffeeCard key={index} cafe={cafe} />
          ))}
        </div>
      </div>
    </>
  );
};

export default AllCoffeeList;
