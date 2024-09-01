import React, { useState, useEffect } from 'react';
import { auth, provider } from '../firebase/firebase';
import Top from './Top';

import Notif from './Notif';
const Notifications = () => {

  return (
    <div className="flex flex-col items-center justify-start">
      <Top text={"Notificaciones"}/>
      <Notif tittle = '¿Te gustó la app?' subt={'Reseñá en Google Play!'}/>
    </div>
  );
};

export default Notifications;
