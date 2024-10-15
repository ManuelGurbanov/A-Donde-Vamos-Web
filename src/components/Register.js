import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { db, storage } from '../firebase/firebase'; 
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

import Top from './Top';

import crearImg from '../img/crearImg.png';

const Register = () => {
  const [fullName, setFullName] = useState(''); // Nombre completo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(''); // Nombre de usuario
  const [profilePicture, setProfilePicture] = useState(null); // Archivo de imagen
  const [mainNeighborhood, setMainNeighborhood] = useState(''); // Barrio principal
  const [showNeighborhood, setShowNeighborhood] = useState(false); // Checkbox para mostrar el barrio
  const [description, setDescription] = useState(''); // Descripción o estado
  const [showPet, setShowPet] = useState(false); // Insignia pet
  const [showTac, setShowTac] = useState(false); // Insignia tac
  const [showVegan, setShowVegan] = useState(false); // Insignia vegano
  const [errorText, setErrorText] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorText('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 10) {
      setErrorText('La contraseña debe tener al menos 10 caracteres.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Si el usuario cargó una foto de perfil, súbela a Firebase Storage
      let profilePictureUrl = '';
      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profilePictureUrl = await getDownloadURL(storageRef); // Obtener la URL de descarga de la imagen
      }

      // Actualizar el perfil del usuario con el nombre de usuario y la URL de la foto
      await updateProfile(user, { displayName: username, photoURL: profilePictureUrl });

      // Enviar correo de verificación
      await sendEmailVerification(user);

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        fullName: fullName, // Guardar el nombre completo
        email: email,
        profilePicture: profilePictureUrl, // Guardar la URL de la foto
        mainNeighborhood: mainNeighborhood,
        showNeighborhood: showNeighborhood,
        description: description, // Guardar la descripción o estado
        showPet: showPet, // Guardar insignia pet
        showTac: showTac, // Guardar insignia tac
        showVegan: showVegan, // Guardar insignia vegano
      });

      console.log('Usuario registrado exitosamente:', user);
      alert('Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.');
    } catch (error) {
      console.error('Error al registrar usuario', error);

      if (error.code === 'auth/email-already-in-use') {
        setErrorText('El correo electrónico ya está registrado.');
      } else {
        setErrorText('Error al registrar usuario.');
      }
    }
  };

  // Manejar la carga del archivo de imagen
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <>
      <Top text={"Registro"} />
      <div className="flex flex-col items-center justify-start min-h-screen">
        <form onSubmit={handleRegister} className="flex flex-col items-center w-4/5 gap-3 p-4 mt-8 rounded shadow-md sm:w-1/4">
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre Completo"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de Usuario"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Contraseña"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />

          {/* Campo para subir la foto de perfil */}
          <label htmlFor="profilePicture" className="w-full p-2 mb-2 font-bold text-center border cursor-pointer rounded-2xl bg-c text-b1 bg-opacity-90">
            {profilePicture ? profilePicture.name : 'Seleccionar Foto de Perfil'}
            <input
              id="profilePicture"
              type="file"
              onChange={handleProfilePictureChange}
              className="hidden"
              accept="image/*"
            />
          </label>
          {profilePicture && <p className="text-center text-green-600">¡Archivo seleccionado!</p>}

          <input
            type="text"
            value={mainNeighborhood}
            onChange={(e) => setMainNeighborhood(e.target.value)}
            placeholder="Barrio Principal"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción o Estado"
            className="w-full p-2 mb-2 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
          />

          <div className="mb-2">
            <input
              type="checkbox"
              checked={showNeighborhood}
              onChange={(e) => setShowNeighborhood(e.target.checked)}
              id="showNeighborhood"
            />
            <label htmlFor="showNeighborhood" className="ml-2">
              Mostrar barrio en perfil
            </label>
          </div>

          <div className="flex flex-col mb-2">
            <label className="flex items-center">
              <input type="checkbox" checked={showPet} onChange={(e) => setShowPet(e.target.checked)} />
              <span className="ml-2">Mostrar insignia Pet Friendly</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={showTac} onChange={(e) => setShowTac(e.target.checked)} />
              <span className="ml-2">Mostrar insignia Tac</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" checked={showVegan} onChange={(e) => setShowVegan(e.target.checked)} />
              <span className="ml-2">Mostrar insignia Vegano</span>
            </label>
          </div>

          <button type="submit" className="flex items-center justify-center w-1/2 p-2 text-white transition-all duration-100 rounded-2xl bg-b1 hover:bg-b2">
            <img className="flex-[1] " src={crearImg}></img>
            <p className="flex-[6] text-c text-sm">Crear Cuenta</p>
          </button>
          {errorText && <p className="mt-2 text-red-500">{errorText}</p>}
        </form>
      </div>
    </>
  );
};

export default Register;
