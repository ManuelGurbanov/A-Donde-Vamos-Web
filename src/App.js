import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CafeteriasList from './components/cafeteriasList';
import AddCafeterias from './components/addCafeterias';
import Login from './components/Login';
import Register from './components/Register';
import Nav from './components/Nav';
import Banner from './components/Banner';
function App() {
  return (
    <Router>
      <div className="w-screen min-h-screen bg-zinc-900">
        <Nav />
        <Routes>
          <Route path="/" element={<CafeteriasList />} />
          <Route path="/add-cafeteria" element={<AddCafeterias />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
