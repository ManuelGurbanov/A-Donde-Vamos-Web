import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { db, storage } from '../firebase/firebase'; 
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 

import Top from './Top';
import crearImg from '../img/crearImg.png';

const Register = () => {
  const [fullName, setFullName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); 
  const [mainNeighborhood, setMainNeighborhood] = useState('');
  const [showNeighborhood, setShowNeighborhood] = useState(false);
  const [description, setDescription] = useState('');
  const [showPet, setShowPet] = useState(false); 
  const [showTac, setShowTac] = useState(false); 
  const [showVegan, setShowVegan] = useState(false); 
  const [errorText, setErrorText] = useState('');
  const [verificationEmailSent, setVerificationEmailSent] = useState(false); 

  const [previewImage, setPreviewImage] = useState(null);


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

      let profilePictureUrl = '';
      if (profilePicture) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePicture);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: username, photoURL: profilePictureUrl });

      // Enviar correo de verificación
      await sendEmailVerification(user);
      setVerificationEmailSent(true); // Mostrar mensaje en la pantalla

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        fullName: fullName,
        email: email,
        profilePicture: profilePictureUrl,
        mainNeighborhood: mainNeighborhood,
        showNeighborhood: showNeighborhood,
        description: description,
        showPet: showPet,
        showTac: showTac,
        showVegan: showVegan,
      });

      // Cerrar sesión automáticamente tras el registro
      signOut(auth);
      alert('Registro exitoso. Revisa tu correo para verificar tu cuenta.');
    } catch (error) {
      console.error('Error al registrar usuario', error);

      if (error.code === 'auth/email-already-in-use') {
        setErrorText('El correo electrónico ya está registrado.');
      } else {
        setErrorText('Error al registrar usuario.');
      }
    }
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);

      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
    }
  };
  

  return (
    <>
      <Top text={"Registro"} />
      <div className="flex flex-col items-center justify-start min-h-screen">
        <form onSubmit={handleRegister} className="flex flex-col items-center w-4/5 gap-1 p-4 mt-8 rounded sm:w-1/4">
          <label className='w-full text-left text-c2 text-lg italic font-bold'>Nombre Privado</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nombre"
            className="w-full p-2 mb-4 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <label className='w-full text-left text-c2 text-lg italic font-bold'>Usuario (no se puede cambiar)</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de Usuario"
            className="w-full p-2 mb-4 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            className="w-full p-2 mb-4 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-2 mb-4 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar Contraseña"
            className="w-full p-2 mb-4 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
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
          {previewImage && (
            <img src={previewImage} alt="Previsualización" className="w-28 h-28 mb-4 border rounded-full ring-c2 ring-2 object-cover" />
          )}

          <input
            type="text"
            value={mainNeighborhood}
            onChange={(e) => setMainNeighborhood(e.target.value)}
            placeholder="Barrio Principal"
            className="w-full p-2 mb-4 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción o Estado"
            className="w-full p-2 mb-4 italic text-black border rounded-2xl bg-b1 placeholder:text-brown"
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

          <div className="flex flex-col mb-4">
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
          {verificationEmailSent && <p className="mt-2 text-green-500">Correo de verificación enviado. Revisa tu bandeja de entrada.</p>}
        </form>
      </div>
    </>
  );
};

export default Register;
