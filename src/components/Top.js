import React from 'react';
const icon = '/icon.png';

const Top = ({text}) => {
  return (
    <div className='flex items-center justify-center w-full h-12 p-8 m-0 border-b-2 bg-b2 rounded-b-3xl border-red-950 sm:w-screen'>
      <h1 className="p-6 mt-2 mb-1 text-2xl font-semibold text-center text-c md:text-4xl">{text || "¿A Dónde Vamos?"}</h1>
    </div>
  );
};

export default Top;
