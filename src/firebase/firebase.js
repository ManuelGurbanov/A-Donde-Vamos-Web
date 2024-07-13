import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyD9ak8YpdGIYuSZIuOprjxH7UrY6l7WyqY",
  authDomain: "a-donde-vamos-web.firebaseapp.com",
  projectId: "a-donde-vamos-web",
  storageBucket: "a-donde-vamos-web.appspot.com",
  messagingSenderId: "428018365247",
  appId: "1:428018365247:web:195247dc180133c54a198a",
  measurementId: "G-V1ZDV9Y0HE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      setUser(result.user);
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return { user, signInWithGoogle, signOut };
};

export { auth, db, provider, useAuth };