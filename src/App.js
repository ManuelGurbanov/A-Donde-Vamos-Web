import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CafeteriasList from './components/cafeteriasList';
import AddCafeterias from './components/addCafeterias';

function App() {
  return (
    <Router>
      <div className="w-screen h-screen bg-slate-800">
        <header className="w-full bg-slate-500 h-[10vh] flex items-center">
          <div className='flex items-center justify-center w-full gap-5 mt-4 mb-4'>
                <Link to="/" className='p-2 text-white transition-all duration-150 bg-slate-800 rounded-xl hover:bg-slate-700'>Home</Link>
                <Link to="/add-cafeteria" className='p-2 text-white transition-all duration-150 bg-slate-800 rounded-xl hover:bg-slate-700'>Añadir Cafeterías</Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<CafeteriasList />} />
          <Route path="/add-cafeteria" element={<AddCafeterias />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
