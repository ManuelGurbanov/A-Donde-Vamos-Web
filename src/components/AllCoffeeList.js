import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const AllCoffeeList = () => {
  const [cafeterias, setCafeterias] = useState([]);
  const [filteredCafeterias, setFilteredCafeterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNeigh, setSelectedNeigh] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  useEffect(() => {
    const fetchCafeterias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cafeterias'));
        const cafesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCafeterias(cafesList);
        setFilteredCafeterias(cafesList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCafeterias();
  }, []);

  const uniqueNeighs = [...new Set(cafeterias.map(cafe => cafe.neigh))];

  const handleFilterChange = (neigh) => {
    setSelectedNeigh(neigh);
    if (neigh === '') {
      setFilteredCafeterias(cafeterias);
    } else {
      setFilteredCafeterias(cafeterias.filter(cafe => cafe.neigh === neigh));
    }
  };

  if (loading) return <div className="mt-24 text-3xl text-center text-white">Cargando Cafeterías...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl text-center text-gray-200">¿A Dónde Vamos?</h1>

      <div className="mb-4 text-center">
        <button
          onClick={() => setIsFilterPanelOpen(true)}
          className="p-2 m-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Filtrar por Barrio
        </button>
      </div>

      {isFilterPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-3/4 p-4 bg-white rounded-lg">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="p-2 font-bold text-white bg-red-500 rounded hover:bg-red-600"
              >
                X
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={() => handleFilterChange('')}
                className={`p-2 m-2 rounded ${selectedNeigh === '' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
              >
                Todos
              </button>
              {uniqueNeighs.map((neigh, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterChange(neigh)}
                  className={`p-2 m-2 rounded ${selectedNeigh === neigh ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                  {neigh}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mb-20 md:grid-cols-2 lg:grid-cols-3">
        {filteredCafeterias.map((cafe, index) => (
          <div key={index} className="p-2">
            <Link to={`/cafe/${cafe.id}`}>
              <div className="relative h-40 overflow-hidden bg-white rounded-lg shadow-md">
                <img src={cafe.picsLinks?.[0] || 'default-image.jpg'} alt={cafe.name} className="object-cover w-full h-full" />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-50">
                  <h2 className="text-lg font-semibold text-white">{cafe.name || 'Nombre no disponible'}</h2>
                  <p className="text-sm font-semibold text-gray-300">{cafe.neigh || 'Barrio no disponible'}</p>
                  <p className="text-sm text-gray-300">{cafe.adress || 'Dirección no disponible'}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCoffeeList;
