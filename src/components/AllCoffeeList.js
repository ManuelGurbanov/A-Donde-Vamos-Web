import React, { useState, useEffect, useContext, useRef } from 'react';
import { CafeContext } from './CafeContext';
import CoffeeCard from './CoffeeCard';
//import Top from './Top';
import screen2 from '../img/screen2.png';
import filtersIcon from '../img/filters.webp';

const AllCoffeeList = () => {
  const { cafes, loading, error } = useContext(CafeContext);
  const [filteredCafeterias, setFilteredCafeterias] = useState([]);
  const [visibleCafeterias, setVisibleCafeterias] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBy, setSearchBy] = useState('cafe');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cafeNotable: false,
    coworking: false,
    outside: false,
    patio: false,
    pet: false,
    terraza: false,
    vegan: false,
    tac: false,
    takeaway: false,
  });

  const pageSize = 15;
  const loadMoreRef = useRef(null);
  
  const normalizeText = (text) =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  
  const neighborhoodGroups = [
    ['microcentro', 'san nicolás', 'congreso', 'balvanera'],
  ];
  
  useEffect(() => {
    let filtered = cafes;
  
    if (filters.cafeNotable) filtered = filtered.filter(cafe => cafe.cafeNotable);
    if (filters.coworking) filtered = filtered.filter(cafe => cafe.coworking);
    if (filters.outside) filtered = filtered.filter(cafe => cafe.outside);
    if (filters.patio) filtered = filtered.filter(cafe => cafe.patio);
    if (filters.pet) filtered = filtered.filter(cafe => cafe.pet);
    if (filters.terraza) filtered = filtered.filter(cafe => cafe.terraza);
    if (filters.vegan) filtered = filtered.filter(cafe => cafe.vegan);
    if (filters.tac) filtered = filtered.filter(cafe => cafe.tac);
    if (filters.takeaway) filtered = filtered.filter(cafe => cafe.takeaway);
  
    if (searchQuery) {
      const normalizedQuery = normalizeText(searchQuery);
      const matchedGroup = neighborhoodGroups.find(group =>
        group.some(neigh => normalizeText(neigh).includes(normalizedQuery))
      );
      filtered = filtered.filter(cafe => {
        const fieldToCompare = searchBy === 'neigh' ? cafe.neigh : cafe.name;
        const normalizedField = normalizeText(fieldToCompare);
  
        return matchedGroup
          ? matchedGroup.some(neigh => normalizedField.includes(neigh))
          : normalizedField.includes(normalizedQuery);
      });
    }
  
    filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    setFilteredCafeterias(filtered);
    setVisibleCafeterias(filtered.slice(0, pageSize));
  }, [filters, searchQuery, searchBy, cafes]);
  

  const loadMoreCafes = () => {
    setVisibleCafeterias(prev => [
      ...prev,
      ...filteredCafeterias.slice(prev.length, prev.length + pageSize),
    ]);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCafeterias.length < filteredCafeterias.length) {
          loadMoreCafes();
        }
      },
      { root: null, rootMargin: '100px', threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [visibleCafeterias, filteredCafeterias]);

  const toggleFilter = (filterName) => {
    setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  const handleSavePreferences = () => {
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      cafeNotable: false,
      coworking: false,
      outside: false,
      patio: false,
      pet: false,
      terraza: false,
      vegan: false,
      tac: false,
      takeaway: false,
    });
  };

  if (loading) return <div className="mt-24 text-3xl text-center text-white">Cargando Cafeterías...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <>
      {/* <Top /> */}
      <div className="p-4 m-auto sm:w-3/4">
        <div className="flex mb-1 w-full justify-between font-bold text-c">
          <button
            className={`${searchBy === 'cafe' ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => setSearchBy('cafe')}
          >
            Buscar por Cafetería
          </button>
          <button
            className={`mr-2 ${searchBy === 'neigh' ? 'opacity-100' : 'opacity-50'}`}
            onClick={() => setSearchBy('neigh')}
          >
            Buscar por Barrio
          </button>
        </div>

        <hr className="w-full h-[2px] bg-c2 border-none bg-opacity-40 m-auto mb-2" />

        <div className="relative w-full m-auto sm:w-1/2 mb-4 text-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`${searchBy === 'neigh' ? 'Buscar Barrios' : 'Buscar Cafeterías'}`}
            className="w-full p-2 pl-10 text-black border rounded-lg placeholder-c bg-zinc-300"
          />
          <img
            src={screen2}
            alt="Search Icon"
            className="absolute w-5 h-5 transform -translate-y-1/2 top-1/2 left-3"
          />
        </div>

        <button
          className="flex mb-1 w-full justify-between items-center font-bold text-c"
          onClick={() => setShowFilters(true)}
        >
          <p class name="text-xl">Aplicar Filtros</p>
          <img src="filters.webp" alt="Filters Icon" className="w-5" />
        </button>

        <div className="grid grid-cols-1 gap-4 mb-16 md:grid-cols-2 lg:grid-cols-3">
          {visibleCafeterias.length > 0 ? (
            visibleCafeterias.map((cafe, index) => (
              <CoffeeCard key={index} cafe={cafe} />
            ))
          ) : (
            <div className="text-xl text-center text-gray-500 col-span-full">
              No se encontraron cafeterías
            </div>
          )}
        </div>
        {/* Elemento observado para cargar más cafeterías */}
        <div ref={loadMoreRef} style={{ height: '1px' }}></div>
      </div>

      {showFilters && (
        <>
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setShowFilters(false)}></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 w-full max-w-lg mx-auto shadow-lg z-50">
            <h1 className="w-full p-4 text-2xl font-bold text-left text-c1">Aplicar Filtros</h1>
            <div className="text-center">
              <div className="grid grid-cols-3 justify-center font-semibold gap-3 text-b1">
                <button
                  onClick={() => toggleFilter('cafeNotable')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.cafeNotable ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Café Notable
                </button>
                <button
                  onClick={() => toggleFilter('coworking')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.coworking ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Coworking
                </button>
                <button
                  onClick={() => toggleFilter('outside')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.outside ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Mesas Afuera
                </button>
                <button
                  onClick={() => toggleFilter('patio')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.patio ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Patio
                </button>
                <button
                  onClick={() => toggleFilter('pet')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.pet ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Pet Friendly
                </button>
                <button
                  onClick={() => toggleFilter('terraza')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.terraza ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Terraza
                </button>
                <button
                  onClick={() => toggleFilter('vegan')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.vegan ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Opciones Veganas
                </button>

                <button
                  onClick={() => toggleFilter('tac')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-4 flex justify-center items-center ${filters.tac ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Opciones sin Gluten
                </button>
                <button
                  onClick={() => toggleFilter('takeaway')}
                  className={`w-[102px] h-[28px] m-2 rounded-2xl text-xs text-center text-b1 p-2 flex justify-center items-center ${filters.takeaway ? 'bg-c2' : 'bg-gray-200 '}`}
                >
                  Take Away
                </button>
              </div>
              </div>
              <div className="flex flex-col items-center justify-center w-full p-4">
              <button
                onClick={clearFilters}
                className="w-full h-12 p-1 m-2 text-c rounded-lg font-semibold bg-b1 hover:bg-c hover:text-b1"
              >
                Borrar todos los Filtros
              </button>
              <button
                onClick={handleSavePreferences}
                className="w-full h-12 p-1 m-2 text-c font-semibold rounded-lg bg-b1 hover:bg-c hover:text-b1"
              >
                Guardar
              </button>
            </div>
            </div>
        </>
      )}
    </>
  );
};

export default AllCoffeeList;