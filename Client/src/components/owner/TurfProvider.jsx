import React, { createContext, useState, useContext } from 'react';

const TurfContext = createContext();

export const TurfProvider = ({ children }) => {
  const [selectedTurf, setSelectedTurf] = useState(null);
  return (
    <TurfContext.Provider value={{ selectedTurf, setSelectedTurf }}>
      {children}
    </TurfContext.Provider>
  );
};

export const useTurfContext = () => useContext(TurfContext);
