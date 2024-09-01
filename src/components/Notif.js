import React from 'react';
const icon = './icon.png';

const Notif = ({tittle, subt}) => {
  return (
    <div className= 'flex items-center w-full h-20 m-0 mt-4 border-b-2 bg-b2 border-red-950 sm:w-screen'>

     <div className='flex flex-col'>
      <h1 className="w-full p-1 ml-4 text-xl font-bold text-left text-black md:text-xl">{tittle || "Nueva Cafetería en Colegiales"}</h1>
      <h2 className="w-full p-1 ml-4 text-xl font-normal text-left text-c md:text-xl">{subt || "Boiro Café"}</h2>
     </div>
      <section className='absolute right-12'>
        <img src={icon} className='w-12 h-12'></img>
      </section>

    </div>
  );
};

export default Notif;
