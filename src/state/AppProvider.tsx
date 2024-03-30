import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';


type AppProviderProps = {
  children: ReactNode;
};

type SharedData = {
  pageNumberGarage: number;
  pageNumberWinner: number;
  winner: 0
};
type SetSharedData = Dispatch<SetStateAction<SharedData>>;

const initialSharedData: SharedData = {
  pageNumberGarage: 1,
  pageNumberWinner: 1,
  winner: 0
};

const AppContext = createContext<{
  sharedData: SharedData;
  setSharedData: React.Dispatch<React.SetStateAction<SharedData>>;
}>({
  sharedData: initialSharedData,
  setSharedData: () => { },
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: AppProviderProps) => {

  const [sharedData, setSharedData] = useState<SharedData>(initialSharedData);

  return (
    <AppContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </AppContext.Provider>
  );
};
