import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import CoffeeDetails from './components/CoffeeDetails';
import screen1 from './img/screen1.png';
import screen3 from './img/screen3.png';
import screen4 from './img/screen4.png';
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import AddForm from './components/AddForm';
import Register from './components/Register';
import AllCoffeeList from './components/AllCoffeeList';

import Home from './components/Home';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col w-screen h-screen bg-zinc-900 sm:max-w-lg">
        <div className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cafe/:id" element={<CoffeeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add" element={< AddForm/>} />
            <Route path="/coffee-all" element={<AllCoffeeList />} />
          </Routes>
        </div>
        {/* Esto de abajo es la Nav */}
        <div className="fixed bottom-0 flex items-center justify-around w-full h-16 text-white bg-gray-800 sm:max-w-lg">

          <a href="/" className="w-12">
            <img src={screen1} alt="Pantalla 1" />
          </a>

          <a href="/coffee-all" className="w-12">
            <img src={screen1} alt="Pantalla 4" />
          </a>

          <a href="/add" className="w-12">
            <img src={screen3} alt="Pantalla 4" />
          </a>
          
          <a href="/login" className="w-12">
            <img src={screen4} alt="Pantalla 4" />
          </a>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
