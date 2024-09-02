import React from 'react';
const icon = '/icon.png';

const Top = ({text}) => {
  return (
    <div className='flex items-center justify-center w-full h-24 p-8 m-0 border-b-2 bg-b2 rounded-b-3xl border-red-950 sm:w-screen'>
      <h1 className="flex-[4] mt-2 mb-1 text-2xl font-bold text-center text-c md:text-4xl p-6 ml-6">{text || "¿A Dónde Vamos?"}</h1>
      <section className='mr-12'>
        <img src={icon} className='w-12 h-12'></img>
      </section>

    </div>
  );
};

export default Top;
