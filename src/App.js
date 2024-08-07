import React, { useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CafeteriasList from './components/CoffeeList';
import CafeDetails from './components/CafeDetails';
import Screen4 from './components/Screen4';
import screen1 from './img/screen1.png';
import screen1Selected from './img/screen1-selected.png';
import screen2 from './img/screen2.png';
import screen2Selected from './img/screen2-selected.png';
import screen3 from './img/screen3.png';
import screen3Selected from './img/screen3-selected.png';
import screen4 from './img/screen4.png';
import screen4Selected from './img/screen4-selected.png';

function App() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const navigate = useNavigate();

  const handleScreenChange = (screenNumber) => {
    setCurrentScreen(screenNumber);
    switch (screenNumber) {
      case 1:
        navigate('/');
        break;
      case 2:
        navigate('/screen2');
        break;
      case 3:
        navigate('/screen3');
        break;
      case 4:
        navigate('/screen4');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-zinc-900">
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<CafeteriasList />} />
          <Route path="/cafe/:id" element={<CafeDetails />} />
          <Route path="/screen2" element={<div className="flex items-center justify-center h-full text-white"><h1>Pantalla 2</h1></div>} />
          <Route path="/screen3" element={<div className="flex items-center justify-center h-full text-white"><h1>Pantalla 3</h1></div>} />
          <Route path="/screen4" element={<Screen4 />} />
        </Routes>
      </div>
      <div className="flex items-center justify-around h-16 text-white bg-gray-800">
        <button onClick={() => handleScreenChange(1)}>
          <img src={currentScreen === 1 ? screen1Selected : screen1} alt="Pantalla 1" className='w-12'/>
        </button>
        <button onClick={() => handleScreenChange(2)}>
          <img src={currentScreen === 2 ? screen2Selected : screen2} alt="Pantalla 2" className='w-12'/>
        </button>
        <button onClick={() => handleScreenChange(3)}>
          <img src={currentScreen === 3 ? screen3Selected : screen3} alt="Pantalla 3" className='w-12'/>
        </button>
        <button onClick={() => handleScreenChange(4)}>
          <img src={currentScreen === 4 ? screen4Selected : screen4} className='w-12' />
        </button>
      </div>
    </div>
  );
}

export default App;
