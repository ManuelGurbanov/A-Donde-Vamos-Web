import React from 'react';
import like_notif from '../img/like_notif.png';


const Notif = ({ tittle, subt }) => {
  return (
    <div className='flex items-center justify-between w-[90vw] sm:w-[35vw] h-16 p-5 m-0 mt-4 border-b-2 bg-b2 border-c rounded-3xl bg-opacity-60'>
      <img src={like_notif} className='flex-shrink-0 w-7' alt="like icon" />

      <div className='flex flex-col flex-grow w-full ml-6'>
        <h1 className="text-sm font-bold text-left text-c md:text-xl">
          {tittle}
        </h1>
        <h2 className="text-sm font-bold text-left text-c2 md:text-xl">
          {subt}
        </h2>
      </div>      
    </div>
  );
};

export default Notif;
