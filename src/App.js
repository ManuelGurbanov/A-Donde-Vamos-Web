import React, { useContext, useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext'; 
import { CafeProvider } from './components/CafeContext';

import Home from './components/Home';
import CoffeeDetails from './components/CoffeeDetails';
import Login from './components/Login';
import Register from './components/Register';
import AddForm from './components/AddForm';
import AllCoffeeList from './components/AllCoffeeList';
import Layout from './components/Layout';
import Notifications from './components/Notifications';
import ForgotPassword from './components/ForgotPassword';
import EditCoffeeForm from './components/EditCoffeeForm';
import DiscountPage from './components/DiscountPage';

function App() {
  const [topText, setTopText] = useState("Nombre del Café");

  useEffect(() => {
    console.log(process.env.REACT_APP_API_KEY)
  }, []);

  return (
    <div className="app-container">
      <AuthProvider>
        <CafeProvider>
          <Routes>
            <Route path="/" element={<Layout setTopText={setTopText} />}>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/:slug" element={<CoffeeDetails />} />
              <Route path="/:slug/editar" element={<EditCoffeeForm />} />
              <Route path="/:slug/discount" element={<DiscountPage />} />
              <Route path="/profile/:uid" element={<Login />} />
              <Route path="/profile" element={<ProfileRedirect />} />

              <Route path="/register" element={<Register />} />
              <Route path="/add" element={<AddForm />} />
              <Route path="/coffee-all" element={<AllCoffeeList />} />
              <Route path="/notifications" element={<Notifications/>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
          </Routes>
        </CafeProvider>
      </AuthProvider>
    </div>
  );
}

const ProfileRedirect = () => {
  const { currentUser } = useContext(AuthContext);
  return <Navigate to={`/profile/${currentUser.uid}`} />;
};

export default App;
