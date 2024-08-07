import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddForm = () => {
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
      picsLinks: picsLinks.filter(link => link !== ''),
      score,
      schedules,
      vegan,
      tac,
      pet,
      outside,
      menuLink,
      reviews
    });
    // Reset form
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
    <form onSubmit={handleSubmit} className="max-w-lg p-8 mx-auto mb-20 text-white bg-gray-800 rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-center text-white">Agregar Cafetería</h2>
      
      <div className="mb-4">
        <label className="block text-white">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Nombre"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Dirección</label>
        <input
          type="text"
          value={adress}
          onChange={(e) => setAdress(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Dirección"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Barrio</label>
        <input
          type="text"
          value={neigh}
          onChange={(e) => setNeigh(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Barrio"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Descripción"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Instagram</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Instagram"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Fotos (Máx. 4)</label>
        <div className="flex flex-wrap">
          {picsLinks.map((link, index) => (
            index < 4 ? (
              <input
                key={index}
                type="text"
                value={link}
                onChange={(e) => {
                  const newPicsLinks = [...picsLinks];
                  newPicsLinks[index] = e.target.value;
                  setPicsLinks(newPicsLinks);
                }}
                className={`px-3 py-2 mb-2 border rounded-lg bg-blue-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  index === 0 ? 'w-full' : 'w-1/2'
                }`}
                placeholder={`Foto ${index + 1}`}
              />
            ) : null
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-white">Puntaje</label>
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Puntaje"
          min="0"
          max="10"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Horarios</label>
        <input
          type="text"
          value={schedules}
          onChange={(e) => setSchedules(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Horarios"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Vegano</label>
        <input
          type="checkbox"
          checked={vegan}
          onChange={(e) => setVegan(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Apto Celíacos</label>
        <input
          type="checkbox"
          checked={tac}
          onChange={(e) => setTac(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Pet Friendly</label>
        <input
          type="checkbox"
          checked={pet}
          onChange={(e) => setPet(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Mesas Afuera</label>
        <input
          type="checkbox"
          checked={outside}
          onChange={(e) => setOutside(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-white">Link al Menú</label>
        <input
          type="text"
          value={menuLink}
          onChange={(e) => setMenuLink(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          placeholder="Link al Menú"
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
      >
        Agregar Cafetería
      </button>
    </form>
  );
};

export default AddForm;
