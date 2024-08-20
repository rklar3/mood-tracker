'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the type for the context value
type ThemeContextType = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  background: string;
  setBackground: (gradient: string) => void;
};

// Create the context
const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  background: 'linear-gradient(270deg, #3498db, #e91e63, #9b59b6, #3498db)', // Default background
  setBackground: () => {},
});

// Create a provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const getInitialDarkMode = () => {
    // const savedTheme = localStorage.getItem("darkMode");
    const savedTheme = false;

    return savedTheme ? JSON.parse(savedTheme) : false;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialDarkMode);
  const [background, setBackground] = useState<string>(
    'linear-gradient(270deg, #3498db, #e91e63, #9b59b6, #3498db)'
  );

  // Save theme to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save background to local storage whenever it changes
  useEffect(() => {
    // localStorage.setItem("background", background);
  }, [background]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, background, setBackground }}>
      <div className={isDarkMode ? "" : "dark"} style={{ background }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);
