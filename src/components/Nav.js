import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Añadir Cafetería', href: '/add-cafeteria' },
  { name: 'Ver en Google Play', href: 'https://www.googleplay.com' },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <header className="bg-zinc-900">
      <nav className="flex items-center justify-between p-6 mx-auto max-w-7xl lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <img
            src="https://i.ibb.co/K5nTmd7/Black-Icon.png"
            className="w-12 h-12"
            alt="logo"
          />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
            onClick={() => setMobileMenuOpen(true)}
          >
            <img
              src="burguer.png"
              className="w-9"
              alt="menu"
            />
          </button>
        </div>

        <div className="items-center hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href} className="flex items-center justify-center text-sm font-semibold leading-6 text-white hover:text-coffee">
              {item.name}
            </Link>
          ))}
          {!user && (
            <Link to="/login" className="flex items-center justify-center px-3 py-2 text-sm font-semibold leading-6 text-white bg-blue-600 rounded hover:bg-blue-700">
              Iniciar Sesión
            </Link>
          )}
          {user && (
            <>
              <span className="flex items-center justify-center text-sm font-semibold leading-6 text-white">
                {user.displayName || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center justify-center px-3 py-2 text-sm font-semibold leading-6 text-white bg-red-600 rounded hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </nav>

      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full px-6 py-6 overflow-y-auto bg-zinc-900 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-start">
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(false)}
            >
              <h1 className="text-xl font-bold text-coffee">Cerrar</h1>
            </button>
          </div>
          <div className="flow-root mt-6">
            <div className="-my-6 divide-y divide-gray-500/25">
              <div className="py-6 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center justify-center block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-white rounded-lg hover:bg-gray-800"
                  >
                    {item.name}
                  </Link>
                ))}
                {!user && (
                  <Link to="/login" className="flex items-center justify-center block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    Iniciar Sesión
                  </Link>
                )}
                {user && (
                  <>
                    <span className="flex items-center justify-center block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-white">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center block px-3 py-2 -mx-3 text-base font-semibold leading-7 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
}
