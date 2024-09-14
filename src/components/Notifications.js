import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebase'; // Asegúrate de que esta sea la ruta correcta
import Top from './Top';
import Notif from './Notif';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser && currentUser.uid) {
        try {
          // Obtener notificaciones
          const notificationsRef = collection(db, 'notifications');
          const q = query(
            notificationsRef,
            orderBy('timestamp', 'desc')
          );

          const notificationsSnapshot = await getDocs(q);
          const fetchedNotifications = notificationsSnapshot.docs.map(doc => doc.data());

          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Top text={"Notificaciones"} />
        <Notif tittle="Cargando..." subt="Espera un momento mientras cargamos tus notificaciones." />
      </div>
    );
  }

  return (
    <>
      <Top text={"Notificaciones"} />
      <div className="flex flex-col items-center justify-start w-full sm:w-1/2 sm:m-auto">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <Notif 
              key={index}
              tittle={notif.message}
              subt={notif.link ? <a href={notif.link} className="text-blue-500 underline">Ver más</a> : ''}
            />
          ))
        ) : (
          <Notif tittle="No tienes notificaciones" subt={'¡Te actualizaremos pronto!'}/>
        )}
      </div>
    </>
  );
};

export default Notifications;
