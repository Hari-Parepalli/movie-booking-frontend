import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'selectedCity';
const DEFAULT_CITY = 'Hyderabad';

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>(DEFAULT_CITY);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedCity = localStorage.getItem(STORAGE_KEY);
      if (storedCity) {
        setSelectedCityState(storedCity);
      }
    } catch (error) {
      console.error('Failed to read city from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync to localStorage whenever city changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, selectedCity);
      } catch (error) {
        console.error('Failed to save city to localStorage:', error);
      }
    }
  }, [selectedCity, isLoading]);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
  };

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
