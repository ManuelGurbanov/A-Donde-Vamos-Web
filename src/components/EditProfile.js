import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { db, storage } from '../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import Top from './Top';

const EditProfile = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    profilePicture: null,
    mainNeighborhood: '',
    showNeighborhood: false,
    description: '',
    showPet: false,
    showTac: false,
    showVegan: false,
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    loadUserData();
  }, [user]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorText('');
    setSuccessText('');

    try {
      let profilePictureUrl = userData.profilePicture;
      if (newProfilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, newProfilePicture);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: userData.username, photoURL: profilePictureUrl });

      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        profilePicture: profilePictureUrl,
      });

      setSuccessText('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      setErrorText('Error al actualizar el perfil.');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start min-h-screen">
        <form onSubmit={handleSave} className="flex flex-col items-center w-full gap-1 p-4 mt-8 rounded">
          <label className='text-c2 font-bold text-left italic w-full'>Nombre</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleInputChange}
            placeholder="Nombre Completo"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <label htmlFor="profilePicture" className="w-full p-2 mb-2 font-bold text-center border cursor-pointer rounded-2xl bg-c text-b1 bg-opacity-90">
            {newProfilePicture ? newProfilePicture.name : 'Seleccionar Nueva Foto de Perfil'}
            <input
              id="profilePicture"
              type="file"
              onChange={handleProfilePictureChange}
              className="hidden"
              accept="image/*"
            />
          </label>
          {newProfilePicture && <p className="text-center text-green-600">¡Archivo seleccionado!</p>}

          <label className='text-c2 font-bold text-left italic w-full'>Barrio Principal</label>
          <input
            type="text"
            name="mainNeighborhood"
            value={userData.mainNeighborhood}
            onChange={handleInputChange}
            placeholder="Barrio Principal"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
          />
          <label className='text-c2 font-bold text-left italic w-full'>Descripción</label>
            <textarea
            name="description"
            value={userData.description}
            onChange={handleInputChange}
            placeholder="Descripción o Estado"
            className="w-full p-2 mb-2 text-start text-black border rounded-2xl bg-b1 placeholder:text-brown h-48"
            maxLength={140}
            />

          
          <div className="mb-2">
            <input
              type="checkbox"
              name="showNeighborhood"
              checked={userData.showNeighborhood}
              onChange={handleInputChange}
              id="showNeighborhood"
            />
            <label htmlFor="showNeighborhood" className="ml-2">
              Mostrar barrio en perfil
            </label>
          </div>
          <div className="flex flex-col mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="showPet"
                checked={userData.showPet}
                onChange={handleInputChange}
              />
              <span className="ml-2">Mostrar insignia Pet Friendly</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="showTac"
                checked={userData.showTac}
                onChange={handleInputChange}
              />
              <span className="ml-2">Mostrar insignia Tac</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="showVegan"
                checked={userData.showVegan}
                onChange={handleInputChange}
              />
              <span className="ml-2">Mostrar insignia Vegano</span>
            </label>
          </div>

          <button type="submit" className="flex items-center justify-center w-1/2 p-2 text-white transition-all duration-100 rounded-2xl bg-b1 hover:bg-b2">
            Guardar Cambios
          </button>

          {errorText && <p className="mt-2 text-red-500">{errorText}</p>}
          {successText && <p className="mt-2 text-green-500">{successText}</p>}
        </form>
      </div>
    </>
  );
};

export default EditProfile;
