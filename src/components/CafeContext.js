import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const CafeContext = createContext();

export const CafeProvider = ({ children }) => {
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  const [selectedCafe, setSelectedCafe] = useState(null);
  const [selectedNeighs, setSelectedNeighs] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cafesLoaded, setCafesLoaded] = useState(false);

  useEffect(() => {
    const fetchCafes = async () => {
      if (!cafesLoaded) {
        try {
          console.log("LLAMANDO A BASE DE DATOS");
          const querySnapshot = await getDocs(collection(db, 'cafeterias'));
          const cafesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCafes(cafesList);
          setLoading(false);
          setCafesLoaded(true);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        console.log("NO HACE FALTA LLAMAR");
      }
    };
  
    fetchCafes();
  }, [cafesLoaded]);
  
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const storedNeighs = JSON.parse(localStorage.getItem('preferredNeighs'));
    if (storedNeighs && storedNeighs.length > 0) {
      setSelectedNeighs(storedNeighs);
    }

    localStorage.setItem('preferredNeighs', JSON.stringify(selectedNeighs));
  }, [selectedNeighs]);

  const agregarAFavoritos = (cafe) => {
    setFavoritos((prevFavoritos) => {
      if (prevFavoritos.find(fav => fav.id === cafe.id)) {
        return prevFavoritos.filter(fav => fav.id !== cafe.id);
      } else {
        return [...prevFavoritos, cafe];
      }
    });
  };

  const handleNeighSelection = (neigh) => {
    setSelectedNeighs(prevNeighs => {
      if (prevNeighs.includes(neigh)) {
        return prevNeighs.filter(n => n !== neigh);
      } else {
        return [...prevNeighs, neigh];
      }
    });
  };

  const checkIfOpen = (cafe) => {
    const now = new Date();
    const currentDay = now.toLocaleString('es-ES', { weekday: 'long' }).toLowerCase();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const schedule = cafe.schedules?.dias;
    if (!schedule || !schedule[currentDay]) {
      return { open: false, message: "Cerrado - Sin horario definido." };
    }

    const { apertura, cierre } = schedule[currentDay];
    const openingTime = apertura.getHours() * 60 + apertura.getMinutes();
    const closingTime = cierre.getHours() * 60 + cierre.getMinutes();
    const isClosedOvernight = closingTime < openingTime;

    const isOpen = currentTime >= openingTime && (currentTime < closingTime || isClosedOvernight);

    if (!isOpen) {
      for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (now.getDay() + i) % 7;
        const nextDay = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'][nextDayIndex];

        if (schedule[nextDay]?.apertura) {
          const nextOpeningTime = schedule[nextDay].apertura.getHours() * 60 + schedule[nextDay].apertura.getMinutes();
          const nextOpeningMessage = `${nextDay.charAt(0).toUpperCase() + nextDay.slice(1)} a las ${schedule[nextDay].apertura.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
          return { open: false, message: `Cerrado - Abre ${nextOpeningMessage}` };
        }
      }
    }

    return { open: true, message: "Abierto" };
  };

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
      handleNeighSelection,
      isAuthenticated,
      checkIfOpen
    }}>
      {children}
    </CafeContext.Provider>
  );
};
