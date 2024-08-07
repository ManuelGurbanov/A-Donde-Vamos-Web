import React, { createContext, useState } from 'react';

export const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState(1);

  return (
    <ScreenContext.Provider value={{ currentScreen, setCurrentScreen }}>
      {children}
    </ScreenContext.Provider>
  );
};
