import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CafeProvider } from './components/CafeContext';

import Home from './components/Home';
import CoffeeDetails from './components/CoffeeDetails';
import Login from './components/Login';
import Register from './components/Register';
import AddForm from './components/AddForm';
import AllCoffeeList from './components/AllCoffeeList';
import Layout from './components/Layout';
import Review from './components/Review';
import { Navigate } from 'react-router-dom';

import Notifications from './components/Notifications';

function App() {
  return (
    <div className="">
      <AuthProvider>
        <CafeProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/cafe/:id" element={<CoffeeDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/add" element={<AddForm />} />
              <Route path="/coffee-all" element={<AllCoffeeList />} />
              <Route path="/notifications" element={<Notifications/>} />
            </Route>
          </Routes>
        </CafeProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
