import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Home from './components/Home';
import CoffeeDetails from './components/CoffeeDetails';
import Login from './components/Login';
import Register from './components/Register';
import AddForm from './components/AddForm';
import AllCoffeeList from './components/AllCoffeeList';
import Layout from './components/Layout';

import { Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="bg-c">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cafe/:id" element={<CoffeeDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add" element={<AddForm />} />
            <Route path="/coffee-all" element={<AllCoffeeList />} />
          </Route>
        </Routes>
      </AuthProvider>
    </div>

  );
}

export default App;