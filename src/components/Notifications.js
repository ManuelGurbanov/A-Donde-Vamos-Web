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
        // Verificar si ya hay notificaciones guardadas en sessionStorage
        const storedNotifications = sessionStorage.getItem('notifications');
        
        // Si no hay notificaciones en sessionStorage, las obtenemos de Firebase
        if (!storedNotifications) {
          try {
            // Obtener notificaciones de Firebase
            const notificationsRef = collection(db, 'notifications');
            const q = query(
              notificationsRef,
              orderBy('timestamp', 'desc')
            );

            const notificationsSnapshot = await getDocs(q);
            const fetchedNotifications = notificationsSnapshot.docs.map(doc => doc.data());

            // Guardar las notificaciones en sessionStorage para la sesión actual
            sessionStorage.setItem('notifications', JSON.stringify(fetchedNotifications));

            // Establecer las notificaciones en el estado
            setNotifications(fetchedNotifications);
          } catch (error) {
            console.error('Error fetching notifications:', error);
          }
        } else {
          // Si ya están guardadas en sessionStorage, las usamos directamente
          setNotifications(JSON.parse(storedNotifications));
        }
      }
    };

    fetchNotifications();
  }, [currentUser]);

  return (
    <>
      <div className="flex flex-col items-center justify-start w-full sm:w-1/2 sm:m-auto">
            <Notif 
              tittle="¡Bienvenido a A Dónde Vamos!"
              subt="¡Gracias por unirte! 🚀"
            />
              <Notif 
              tittle="¡OBTENÉ DESCUENTOS!"
              subt="Logueate para obtener 20% en SENEN"
            />
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <Notif 
              key={index}
              tittle={notif.message}
              subt={notif.link !== "" ? <a href={notif.link} className="underline text-c">{notif.submessage}</a> : <p className="text-c">{notif.submessage}</p>}
            />
          ))
        ) : (
          <h1 className="text-xl text-center text-c mt-4">No tienes notificaciones</h1>
        )}
      </div>
    </>
  );
};

export default Notifications;
