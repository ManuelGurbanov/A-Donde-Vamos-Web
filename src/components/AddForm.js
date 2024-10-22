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
  
  const [schedules, setSchedules] = useState({
    lunes_viernes: { apertura: '', cierre: '' },
    sabado: { apertura: '', cierre: '' },
    domingo: { apertura: '', cierre: '' },
    dias: {}
  });

  const [vegan, setVegan] = useState(false);
  const [tac, setTac] = useState(false);
  const [pet, setPet] = useState(false);
  const [outside, setOutside] = useState(false);
  const [coworking, setCoworking] = useState(false);
  const [takeaway, setTakeaway] = useState(false);
  const [menuLink, setMenuLink] = useState('');

  const [patio, setPatio] = useState(false);
  const [terraza, setTerraza] = useState(false);
  const [cafeNotable, setCafeNotable] = useState(false);

  const [closedDays, setClosedDays] = useState([]);

  const daysOfWeek = [
    { id: 0, label: "Domingo" },
    { id: 1, label: "Lunes" },
    { id: 2, label: "Martes" },
    { id: 3, label: "Miércoles" },
    { id: 4, label: "Jueves" },
    { id: 5, label: "Viernes" },
    { id: 6, label: "Sábado" },
  ];

  const toggleDay = (dayId) => {
    setClosedDays((prevClosedDays) =>
      prevClosedDays.includes(dayId)
        ? prevClosedDays.filter((day) => day !== dayId)
        : [...prevClosedDays, dayId]
    );
  };

  const handleScheduleChange = (day, type, value) => {
    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [day]: {
        ...prevSchedules[day],
        [type]: value,
      },
    }));
  };

  const handleCustomScheduleChange = (day, type, value) => {
    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      dias: {
        ...prevSchedules.dias,
        [day]: {
          ...prevSchedules.dias[day],
          [type]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const francos = closedDays.join(',');

    await addDoc(collection(db, 'cafeterias'), {
      googleLink,
      name,
      adress,
      neigh,
      description,
      instagram,
      picsLinks: picsLinks.filter(link => link !== ''),
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
      cafeNotable,
      francos,
    });

    // Resetear el formulario
    setGoogleLink('');
    setName('');
    setAdress('');
    setNeigh('');
    setDescription('');
    setInstagram('');
    setPicsLinks(['', '', '', '', '']);
    setSchedules({
      lunes_viernes: { apertura: '', cierre: '' },
      sabado: { apertura: '', cierre: '' },
      domingo: { apertura: '', cierre: '' },
      dias: {}
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
    setClosedDays([]);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg p-8 mx-auto mb-20 shadow-md text-c2">
      <h2 className="mb-6 text-2xl font-bold text-center text-c2">Agregar Cafetería</h2>
      <h2 className="mb-6 text-2xl font-bold text-center text-c2">(SOLO PARA DESARROLLO)</h2>

      {/* Google Link */}
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

      {/* Nombre */}
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

      {/* Barrio */}
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

      {/* Dirección */}
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

      {/* Café Notable */}
      <div className="mb-4">
        <label className="block text-c2">¿Café Notable?</label>
        <input
          type="checkbox"
          checked={cafeNotable}
          onChange={(e) => setCafeNotable(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

      {/* CoWorking */}
      <div className="mb-4">
        <label className="block text-c2">¿Coworking?</label>
        <input
          type="checkbox"
          checked={coworking}
          onChange={(e) => setCoworking(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

      {/* Apto Celíacos */}
      <div className="mb-4">
        <label className="block text-c2">¿Apto Celíacos?</label>
        <input
          type="checkbox"
          checked={tac}
          onChange={(e) => setTac(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

      {/* Vegano */}
      <div className="mb-4">
        <label className="block text-c2">¿Vegano?</label>
        <input
          type="checkbox"
          checked={vegan}
          onChange={(e) => setVegan(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

      {/* Mesas Afuera */}
      <div className="mb-4">
        <label className="block text-c2">Mesas Afuera</label>
        <input
          type="checkbox"
          checked={outside}
          onChange={(e) => setOutside(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

      {/* Pet Friendly */}
      <div className="mb-4">
        <label className="block text-c2">Pet Friendly</label>
        <input
          type="checkbox"
          checked={pet}
          onChange={(e) => setPet(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

      {/* Patio */}
      <div className="mb-4">
        <label className="block text-c2">¿Tiene Patio?</label>
        <input
          type="checkbox"
          checked={patio}
          onChange={(e) => setPatio(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

           {/* Terraza */}
           <div className="mb-4">
        <label className="block text-c2">¿Tiene Terraza?</label>
        <input
          type="checkbox"
          checked={terraza}
          onChange={(e) => setTerraza(e.target.checked)}
          className="mr-2 leading-tight"
        />
      </div>

      {/* Descripción */}
      <div className="mb-4">
        <label className="block text-c2">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
          placeholder="Descripción"
        ></textarea>
      </div>

      {/* Instagram */}
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

      {/* Fotos */}
      <div className="mb-4">
        <label className="block text-c2">Fotos (Máx. 5)</label>
        <div className="flex flex-wrap">
          {picsLinks.map((link, index) => (
            index < 5 ? (
              <input
                key={index}
                type="text"
                value={link}
                onChange={(e) => {
                  const newPicsLinks = [...picsLinks];
                  newPicsLinks[index] = e.target.value;
                  setPicsLinks(newPicsLinks);
                }}
                className={`w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2 ${index === 0 ? 'w-full' : 'w-1/2'}`}
                placeholder={`Foto ${index + 1}`}
              />
            ) : null
          ))}
        </div>
      </div>

      {/* Link al Menú */}
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

      {/* Francos */}
      <div className="mb-4">
        <label className="block mb-2 text-c2">Francos (Días no laborables)</label>
        <div className="grid grid-cols-7 gap-2">
          {daysOfWeek.map((day) => (
            <button
              key={day.id}
              type="button"
              onClick={() => toggleDay(day.id)}
              className={`px-3 py-2 border rounded-lg focus:outline-none ${closedDays.includes(day.id) ? "bg-blue-500 text-white" : "bg-blue-200"}`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* Horarios */}
      <div className="mb-4">
        <label className="block text-c2">Horarios</label>
        
        {/* Lunes a Viernes */}
        <div className="mb-2">
          <label className="block text-c2">Lunes a Viernes</label>
          <input
            type="text"
            value={schedules.lunes_viernes.apertura}
            onChange={(e) => handleScheduleChange('lunes_viernes', 'apertura', e.target.value)}
            className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
            placeholder="Apertura (HHMM)"
          />
          <input
            type="text"
            value={schedules.lunes_viernes.cierre}
            onChange={(e) => handleScheduleChange('lunes_viernes', 'cierre', e.target.value)}
            className="w-full px-3 py-2 mt-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
            placeholder="Cierre (HHMM)"
          />
        </div>
        
        {/* Sábado */}
        <div className="mb-2">
          <label className="block text-c2">Sábado</label>
          <input
            type="text"
            value={schedules.sabado.apertura}
            onChange={(e) => handleScheduleChange('sabado', 'apertura', e.target.value)}
            className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
            placeholder="Apertura (HHMM)"
          />
          <input
            type="text"
            value={schedules.sabado.cierre}
            onChange={(e) => handleScheduleChange('sabado', 'cierre', e.target.value)}
            className="w-full px-3 py-2 mt-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
            placeholder="Cierre (HHMM)"
          />
        </div>

        {/* Domingo */}
        <div className="mb-2">
          <label className="block text-c2">Domingo</label>
          <input
            type="text"
            value={schedules.domingo.apertura}
            onChange={(e) => handleScheduleChange('domingo', 'apertura', e.target.value)}
            className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
            placeholder="Apertura (HHMM)"
          />
          <input
            type="text"
            value={schedules.domingo.cierre}
            onChange={(e) => handleScheduleChange('domingo', 'cierre', e.target.value)}
            className="w-full px-3 py-2 mt-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2"
            placeholder="Cierre (HHMM)"
          />
        </div>

        {/* Horarios personalizados por día */}
        {daysOfWeek.map((day) => (
          <div key={day.id} className="mb-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                onChange={(e) => {
                  const newDias = { ...schedules.dias };
                  if (e.target.checked) {
                    newDias[day.label] = { apertura: '', cierre: '' };
                  } else {
                    delete newDias[day.label];
                  }
                  setSchedules({ ...schedules, dias: newDias });
                }}
              />
              {day.label} (horario distinto)
            </label>
            {schedules.dias[day.label] && (
              <>
                <input
                  type="text"
                  value={schedules.dias[day.label]?.apertura || ''}
                  onChange={(e) => handleCustomScheduleChange(day.label, 'apertura', e.target.value)}
                  className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2 mt-2"
                  placeholder="Apertura (HHMM)"
                />
                <input
                  type="text"
                  value={schedules.dias[day.label]?.cierre || ''}
                  onChange={(e) => handleCustomScheduleChange(day.label, 'cierre', e.target.value)}
                  className="w-full px-3 py-2 text-black bg-blue-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-c2 mt-2"
                  placeholder="Cierre (HHMM)"
                />
              </>
            )}
          </div>
        ))}
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

