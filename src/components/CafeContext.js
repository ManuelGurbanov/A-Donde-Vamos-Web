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

  const agregarAFavoritos = (cafe) => {
    setFavoritos((prevFavoritos) => {
      if (prevFavoritos.find(fav => fav.id === cafe.id)) {
        return prevFavoritos.filter(fav => fav.id !== cafe.id);
      } else {
        return [...prevFavoritos, cafe];
      }
    });
  };

  return (
    <CafeContext.Provider value={{ cafes, loading, error, favoritos, agregarAFavoritos, selectedCafe, setSelectedCafe }}>
      {children}
    </CafeContext.Provider>
  );
};
