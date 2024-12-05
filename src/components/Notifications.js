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

  return (
    <>
      <Top text={"Notificaciones"} />
      <div className="flex flex-col items-center justify-start w-full sm:w-1/2 sm:m-auto">
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <Notif 
              key={index}
              tittle={notif.message}
              subt={notif.link !== "" ? <a href={notif.link} className="underline text-c">{notif.submessage}</a> : <p href={notif.link} className="text-c">{notif.submessage}</p>}
            />
          ))
        ) : (
          <h1 c1assName="text-3xl text-center text-c">No tienes notificaciones</h1>
        )}
      </div>
    </>
  );
};

export default Notifications;
