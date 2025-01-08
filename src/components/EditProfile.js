import React, { useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/firebase';
import { db, storage } from '../firebase/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { CafeContext } from './CafeContext';

const EditProfile = ({backFunction}) => {
  const { uniqueNeighs, selectedNeighs, handleNeighSelection } = useContext(CafeContext);
  const [userData, setUserData] = useState({
    fullName: '',
    profilePicture: null,
    mainNeighborhood: '',
    showNeighborhood: false,
    description: '',
    showPet: false,
    showTac: false,
    showVegan: false,
    preferredNeighborhoods: [], 
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [errorText, setErrorText] = useState('');
  const [successText, setSuccessText] = useState('');
  const [showNeighborhoodSelector, setShowNeighborhoodSelector] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserData({
            ...userData,
            preferredNeighborhoods: userData.preferredNeighborhoods || []
          });
        }
      }
    };
    loadUserData();
  }, [user]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePicture(file);
  
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleBackWithoutSaving = () => {
    setSuccessText(''); 
    setErrorText('');    
    backFunction(0);     
  };

  const handleSave = async (e) => {
    console.log('Guardando cambios en el perfil');
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

      localStorage.setItem('preferredNeighborhoods', JSON.stringify(selectedNeighs));
      console.log('Barrios preferidos guardados en localStorage', selectedNeighs);

      setSuccessText('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el perfil', error);
      setErrorText('Error al actualizar el perfil.');
    }

    backFunction(0);
  };


  const [showAreYouSure, setShowAreYouSure] = useState(false);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen">
      <form onSubmit={handleSave} className="flex flex-col items-center w-full gap-1 p-4 rounded">
        {/* Nombre */}
        <label className="text-c2 font-bold text-left italic w-full">Nombre</label>
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
        {newProfilePicture && <img src={previewImage} alt="Previsualización" className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 object-cover" />}
        
        {/* Barrio Principal, cambiar a selector */}
        <label className="text-c2 font-bold text-left italic w-full">Barrio Favorito</label>
        <input
          type="text"
          name="mainNeighborhood"
          value={userData.mainNeighborhood}
          onChange={handleInputChange}
          placeholder="Barrio Favorito"
          className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
        />
        
        {/* Descripción */}
        <label className="text-c2 font-bold text-left italic w-full">Descripción</label>
        <textarea
          name="description"
          value={userData.description}
          onChange={handleInputChange}
          placeholder="Descripción o Estado"
          className="w-full p-2 mb-2 text-start text-black border rounded-2xl bg-b1 placeholder:text-brown h-48"
          maxLength={140}
        />

        {/* Selección de barrios preferidos */}
        <div className="mb-2">

        {showNeighborhoodSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-3/4 p-4 bg-white rounded-lg sm:w-1/2">
              <h1 className="w-full p-4 text-2xl font-bold text-left text-c1">
                Recomendarme cafeterías en:
              </h1>
              {/* Hacer scroll vertical */}
              <div className="overflow-y-auto max-h-96">
                {uniqueNeighs && uniqueNeighs.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {uniqueNeighs.map((neigh, index) => (
                      <button
                        key={index}
                        onClick={() => handleNeighSelection(neigh)}ç
                        className={`p-1 m-1 rounded text-sm ${
                          selectedNeighs.includes(neigh) ? 'bg-b2 text-c' : 'bg-gray-200 text-b1'
                        }`}
                      >
                        {neigh}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center justify-center w-full p-4">
                <button
                  onClick={() => setShowNeighborhoodSelector(false)} // Cierra el modal explícitamente
                  className="w-full h-12 p-1 m-2 text-c rounded-lg bg-b1 hover:bg-c hover:text-b1"
                >
                  Guardar Preferencias
                </button>
              </div>
            </div>
          </div>
)}


        </div>

        {/* Insignias */}
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
              <span className="ml-2">Mostrar insignia SIN GLUTEN</span>
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

        <button
          type="submit"
          className="flex items-center justify-center w-1/2 p-2 text-c font-semibold transition-all duration-100 rounded-2xl bg-b1 hover:bg-b2"
        >
          Guardar Cambios
        </button>
        <button className="flex items-center justify-center w-1/2 p-2 text-c font-semibold transition-all duration-100 rounded-2xl bg-b1 hover:bg-b2" onClick={() => setShowAreYouSure(true)}>Volver sin Guardar</button>

        {/* {errorText && <p className="mt-2 text-red-500">{errorText}</p>}
        {successText && <p className="mt-2 text-green-500">{successText}</p>} */}
      </form>

      <div className="absolute z-50 bg-b1 bg-opacity-100 rounded-lg p-4" style={{display: showAreYouSure ? 'block' : 'none'}}>
        <p className="text-c text-center">¿Estás seguro de que deseas volver sin guardar los cambios?</p>
        <div className="flex justify-center gap-4 mt-4">
          <button className="p-2 bg-b2 text-c rounded-lg" onClick={() => setShowAreYouSure(false)}>Cancelar</button>
          <button className="p-2 bg-red-500 text-c rounded-lg" onClick={handleBackWithoutSaving}>Volver sin Guardar</button>
        </div>
      </div>


    </div>
  );
};

export default EditProfile;
