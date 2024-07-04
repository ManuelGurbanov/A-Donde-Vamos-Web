import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddCafeterias = () => {
  const [name, setName] = useState('');
  const [adress, setAdress] = useState('');
  const [neigh, setNeigh] = useState('');
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [picsLinks, setPicsLinks] = useState(['', '', '', '']);
  const [score, setScore] = useState(0);
  const [schedules, setSchedules] = useState('');
  const [vegan, setVegan] = useState(false);
  const [tac, setTac] = useState(false);
  const [pet, setPet] = useState(false);
  const [outside, setOutside] = useState(false);
  const [menuLink, setMenuLink] = useState('');
  const [reviews, setReviews] = useState(['', '', '']);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'cafeterias'), {
      name,
      adress,
      neigh,
      description,
      instagram,
      picsLinks,
      score,
      schedules,
      vegan,
      tac,
      pet,
      outside,
      menuLink,
      reviews
    });
    setName('');
    setAdress('');
    setNeigh('');
    setDescription('');
    setInstagram('');
    setPicsLinks(['', '', '', '']);
    setScore(0);
    setSchedules('');
    setVegan(false);
    setTac(false);
    setPet(false);
    setOutside(false);
    setMenuLink('');
    setReviews(['', '', '']);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Agregar Cafetería</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Nombre"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Dirección</label>
        <input
          type="text"
          value={adress}
          onChange={(e) => setAdress(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Dirección"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Barrio</label>
        <input
          type="text"
          value={neigh}
          onChange={(e) => setNeigh(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Barrio"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Descripción"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Instagram</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Instagram"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Fotos</label>
        {picsLinks.map((link, index) => (
          <input
            key={index}
            type="text"
            value={link}
            onChange={(e) => {
              const newPicsLinks = [...picsLinks];
              newPicsLinks[index] = e.target.value;
              setPicsLinks(newPicsLinks);
            }}
            className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder={`Foto ${index + 1}`}
          />
        ))}
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Puntaje</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Puntaje"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Horarios</label>
        <input
          type="text"
          value={schedules}
          onChange={(e) => setSchedules(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Horarios"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Vegano</label>
        <input
          type="checkbox"
          checked={vegan}
          onChange={(e) => setVegan(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Apto Celíacos</label>
        <input
          type="checkbox"
          checked={tac}
          onChange={(e) => setTac(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Pet Friendly</label>
        <input
          type="checkbox"
          checked={pet}
          onChange={(e) => setPet(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Mesas Afuera</label>
        <input
          type="checkbox"
          checked={outside}
          onChange={(e) => setOutside(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Link al Menú</label>
        <input
          type="text"
          value={menuLink}
          onChange={(e) => setMenuLink(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Link al Menú"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700">Reseñas</label>
        {reviews.map((review, index) => (
          <input
            key={index}
            type="text"
            value={review}
            onChange={(e) => {
              const newReviews = [...reviews];
              newReviews[index] = e.target.value;
              setReviews(newReviews);
            }}
            className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder={`Reseña ${index + 1}`}
          />
        ))}
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        Agregar Cafetería
      </button>
    </form>
  );
};

export default AddCafeterias;
