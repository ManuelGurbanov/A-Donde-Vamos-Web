import React, { useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddForm = () => {
  const [googleLink, setGoogleLink] = useState('');
  const [name, setName] = useState('');
  const [adress, setAdress] = useState('');
  const [neigh, setNeigh] = useState('');
  const [description, setDescription] = useState('');
  const [instagram, setInstagram] = useState('');
  const [picsLinks, setPicsLinks] = useState(['', '', '', '', '']);
  const [menuLink, setMenuLink] = useState('');

  const [schedules, setSchedules] = useState({
    lunes: { apertura: '', cierre: '', cerrado: false },
    martes: { apertura: '', cierre: '', cerrado: false },
    miercoles: { apertura: '', cierre: '', cerrado: false },
    jueves: { apertura: '', cierre: '', cerrado: false },
    viernes: { apertura: '', cierre: '', cerrado: false },
    sabado: { apertura: '', cierre: '', cerrado: false },
    domingo: { apertura: '', cierre: '', cerrado: false }
  });

  const [vegan, setVegan] = useState(false);
  const [tac, setTac] = useState(false);
  const [pet, setPet] = useState(false);
  const [outside, setOutside] = useState(false);
  const [coworking, setCoworking] = useState(false);
  const [takeaway, setTakeaway] = useState(false);
  const [patio, setPatio] = useState(false);
  const [terraza, setTerraza] = useState(false);
  const [cafeNotable, setCafeNotable] = useState(false);

  const handleScheduleChange = (day, type, value) => {
    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [day]: {
        ...prevSchedules[day],
        [type]: value
      }
    }));
  };

  const toggleClosedDay = (day) => {
    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [day]: {
        ...prevSchedules[day],
        cerrado: !prevSchedules[day].cerrado
      }
    }));
  };

  const handlePicsChange = (index, value) => {
    const updatedPics = [...picsLinks];
    updatedPics[index] = value;
    setPicsLinks(updatedPics);
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const slugName = generateSlug(name);

    await addDoc(collection(db, 'cafeterias'), {
      slugName,
      googleLink,
      name,
      adress,
      neigh,
      description,
      instagram,
      picsLinks: picsLinks.filter((link) => link !== ''),
      schedules,
      vegan,
      tac,
      pet,
      outside,
      coworking,
      takeaway,
      menuLink,
      patio,
      terraza,
      cafeNotable
    });

    // Reset del formulario
    setGoogleLink('');
    setName('');
    setAdress('');
    setNeigh('');
    setDescription('');
    setInstagram('');
    setPicsLinks(['', '', '', '', '']);
    setSchedules({
      lunes: { apertura: '', cierre: '', cerrado: false },
      martes: { apertura: '', cierre: '', cerrado: false },
      miercoles: { apertura: '', cierre: '', cerrado: false },
      jueves: { apertura: '', cierre: '', cerrado: false },
      viernes: { apertura: '', cierre: '', cerrado: false },
      sabado: { apertura: '', cierre: '', cerrado: false },
      domingo: { apertura: '', cierre: '', cerrado: false }
    });
    setVegan(false);
    setTac(false);
    setPet(false);
    setOutside(false);
    setCoworking(false);
    setTakeaway(false);
    setMenuLink('');
    setPatio(false);
    setTerraza(false);
    setCafeNotable(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg p-8 mx-auto mb-20 shadow-md text-c2">
      <h2 className="mb-6 text-2xl font-bold text-center text-c2">Agregar Cafetería</h2>

      {/* Información básica */}
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
        <label className="block text-c2">Link a Maps</label>
        <input
          type="text"
          value={googleLink}
          onChange={(e) => setGoogleLink(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Link a Maps"
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
          placeholder="Descripción de la cafetería"
        />
      </div>

      <div className="mb-4">
        <label className="block text-c2">Instagram</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Link de Instagram"
        />
      </div>

      <div className="mb-4">
        <label className="block text-c2">Fotos</label>
        {picsLinks.map((link, index) => (
          <input
            key={index}
            type="text"
            value={link}
            onChange={(e) => handlePicsChange(index, e.target.value)}
            className="w-full px-3 py-2 mt-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
            placeholder={`Link de foto ${index + 1}`}
          />
        ))}
      </div>

      {/* Horarios por día */}
      {Object.keys(schedules).map((day) => (
        <div key={day} className="mb-4">
          <label className="block text-c2 capitalize">
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </label>
          <div className="flex items-center">
            <label className="mr-2">Cerrado:</label>
            <input
              type="checkbox"
              checked={schedules[day].cerrado}
              onChange={() => toggleClosedDay(day)}
            />
          </div>
          {!schedules[day].cerrado && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={schedules[day].apertura}
                onChange={(e) => handleScheduleChange(day, 'apertura', e.target.value)}
                className="w-1/2 px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
                placeholder="Apertura (HHMM)"
              />
              <input
                type="text"
                value={schedules[day].cierre}
                onChange={(e) => handleScheduleChange(day, 'cierre', e.target.value)}
                className="w-1/2 px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
                placeholder="Cierre (HHMM)"
              />
            </div>
          )}
        </div>
      ))}

      <div className="mb-4">
        <label className="block text-c2">Link al Menú</label>
        <input
          type="text"
          value={menuLink}
          onChange={(e) => setMenuLink(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Link al menú"
        />
      </div>

      {/* Características */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center">
          <input type="checkbox" checked={vegan} onChange={(e) => setVegan(e.target.checked)} />
          <span className="ml-2">Opciones Veganas</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={tac} onChange={(e) => setTac(e.target.checked)} />
          <span className="ml-2">Apto para Celíacos</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={pet} onChange={(e) => setPet(e.target.checked)} />
          <span className="ml-2">Pet-Friendly</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={outside} onChange={(e) => setOutside(e.target.checked)} />
          <span className="ml-2">Asientos Afuera</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={coworking} onChange={(e) => setCoworking(e.target.checked)} />
          <span className="ml-2">Coworking</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={takeaway} onChange={(e) => setTakeaway(e.target.checked)} />
          <span className="ml-2">Takeaway</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={patio} onChange={(e) => setPatio(e.target.checked)} />
          <span className="ml-2">Patio</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={terraza} onChange={(e) => setTerraza(e.target.checked)} />
          <span className="ml-2">Terraza</span>
        </label>
        <label className="flex items-center">
          <input type="checkbox" checked={cafeNotable} onChange={(e) => setCafeNotable(e.target.checked)} />
          <span className="ml-2">Café Notable</span>
        </label>
      </div>

      <button type="submit" className="px-4 py-2 mt-4 font-semibold text-white bg-blue-600 rounded-lg">
        Agregar
      </button>
    </form>
  );
};

export default AddForm;
