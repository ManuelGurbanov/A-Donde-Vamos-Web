import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export const CafeContext = createContext();

export const CafeProvider = ({ children }) => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);
  
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedNeighs, setSelectedNeighs] = useState([]);

  // Fetch cafeterias from Firebase
  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'cafeterias'));
        const cafesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCafes(cafesList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCafes();
  }, []);

  // Load selected neighborhoods from localStorage
  useEffect(() => {
    const storedNeighs = JSON.parse(localStorage.getItem('preferredNeighs'));
    if (storedNeighs && storedNeighs.length > 0) {
      setSelectedNeighs(storedNeighs);
    }
  }, []);

  // Add or remove a cafe from favorites
  const agregarAFavoritos = (cafe) => {
    setFavoritos((prevFavoritos) => {
      if (prevFavoritos.find(fav => fav.id === cafe.id)) {
        return prevFavoritos.filter(fav => fav.id !== cafe.id);
      } else {
        return [...prevFavoritos, cafe];
      }
    });
  };

  // Add or remove a neighborhood from the selected list
  const handleNeighSelection = (neigh) => {
    setSelectedNeighs(prevNeighs => {
      if (prevNeighs.includes(neigh)) {
        return prevNeighs.filter(n => n !== neigh);
      } else {
        return [...prevNeighs, neigh];
      }
    });
  };

  // Save selected neighborhoods to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('preferredNeighs', JSON.stringify(selectedNeighs));
  }, [selectedNeighs]);

  return (
    <CafeContext.Provider value={{ 
      cafes, 
      loading, 
      error, 
      favoritos, 
      agregarAFavoritos, 
      selectedCafe, 
      setSelectedCafe, 
      selectedNeighs, 
      handleNeighSelection 
    }}>
      {children}
    </CafeContext.Provider>
  );
};
