import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [accentColor, setAccentColor] = useState({ name: 'Baby Blue', color: '#38BDF8', darkColor: '#60CFF8' });
  const [darkMode, setDarkMode] = useState(false);

  // Function to get system preference
  const getSystemPreference = () => {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  // Load dark mode preference from localStorage or use system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('eden-dark-mode');
    if (savedDarkMode !== null) {
      // User has manually set a preference
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Use system preference as default
      setDarkMode(getSystemPreference());
    }
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedDarkMode = localStorage.getItem('eden-dark-mode');
      if (savedDarkMode === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Save dark mode preference to localStorage whenever it changes
  const updateDarkMode = (newDarkMode) => {
    setDarkMode(newDarkMode);
    localStorage.setItem('eden-dark-mode', newDarkMode.toString());
  };

  // Toggle function for convenience
  const toggleDarkMode = () => {
    updateDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ 
      accentColor, 
      setAccentColor, 
      darkMode, 
      setDarkMode: updateDarkMode,
      toggleDarkMode
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext); 