import React, { useContext } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext'; // Asegúrate de importar el contexto
import { CafeProvider } from './components/CafeContext';

import Home from './components/Home';
import CoffeeDetails from './components/CoffeeDetails';
import Login from './components/Login';
import Register from './components/Register';
import AddForm from './components/AddForm';
import AllCoffeeList from './components/AllCoffeeList';
import Layout from './components/Layout';
import Notifications from './components/Notifications';

function App() {
  return (
    <div className="">
      <AuthProvider>
        <CafeProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Redireccionar a /home */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/cafe/:id" element={<CoffeeDetails />} />
              
              {/* Ruta de perfil que redirige a /profile/currentUserUid */}
              <Route path="/profile/:uid" element={<Login />} />
              <Route path="/profile" element={<ProfileRedirect />} /> {/* Nueva ruta */}

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
const ProfileRedirect = () => {
  const { currentUser } = useContext(AuthContext); // Obtiene el usuario actual desde el contexto
  return <Navigate to={`/profile/${currentUser.uid}`} />;
};

export default App;