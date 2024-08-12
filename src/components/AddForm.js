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
  const [schedules, setSchedules] = useState('');
  const [vegan, setVegan] = useState(false);
  const [tac, setTac] = useState(false);
  const [pet, setPet] = useState(false);
  const [outside, setOutside] = useState(false);
  const [menuLink, setMenuLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'cafeterias'), {
      name,
      adress,
      neigh,
      description,
      instagram,
      picsLinks: picsLinks.filter(link => link !== ''), // Ensure no empty links are added
      schedules,
      vegan,
      tac,
      pet,
      outside,
      menuLink
    });
    // Reset form
    setName('');
    setAdress('');
    setNeigh('');
    setDescription('');
    setInstagram('');
    setPicsLinks(['', '', '', '']);
    setSchedules('');
    setVegan(false);
    setTac(false);
    setPet(false);
    setOutside(false);
    setMenuLink('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg p-8 mx-auto mb-20 shadow-md text-c2">
      <h2 className="mb-6 text-2xl font-bold text-center text-c2">Agregar Cafetería</h2>
      <h2 className="mb-6 text-2xl font-bold text-center text-c2">(SOLO PARA DESARROLLO)</h2>
      <div className="mb-4">
        <label className="block text-c2">Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Nombre"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Dirección</label>
        <input
          type="text"
          value={adress}
          onChange={(e) => setAdress(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Dirección"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Barrio</label>
        <input
          type="text"
          value={neigh}
          onChange={(e) => setNeigh(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Barrio"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Descripción"
        ></textarea>
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Instagram</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Instagram"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Fotos (Máx. 4)</label>
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
                className={`w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2 ${
                  index === 0 ? 'w-full' : 'w-1/2'
                }`}
                placeholder={`Foto ${index + 1}`}
              />
            ) : null
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-c2">Horarios</label>
        <input
          type="text"
          value={schedules}
          onChange={(e) => setSchedules(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Horarios"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Vegano</label>
        <input
          type="checkbox"
          checked={vegan}
          onChange={(e) => setVegan(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Apto Celíacos</label>
        <input
          type="checkbox"
          checked={tac}
          onChange={(e) => setTac(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Pet Friendly</label>
        <input
          type="checkbox"
          checked={pet}
          onChange={(e) => setPet(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Mesas Afuera</label>
        <input
          type="checkbox"
          checked={outside}
          onChange={(e) => setOutside(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-c2">Link al Menú</label>
        <input
          type="text"
          value={menuLink}
          onChange={(e) => setMenuLink(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Link al Menú"
        />
      </div>
      
      <button
        type="submit"
        className="w-full px-4 py-2 text-white rounded-lg bg-c1 hover:bg-c2"
      >
        Agregar Cafetería
      </button>
    </form>
  );
};

export default AddForm;
