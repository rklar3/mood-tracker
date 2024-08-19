'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Create the context
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Create a provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from local storage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Save theme to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    console.log('Dark mode toggled');
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <div className={isDarkMode ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);