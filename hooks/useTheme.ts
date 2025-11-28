'use client';

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component that will wrap the entire app
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        return storedTheme || 'light';
      }
      return 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Effect to apply the theme class to the <html> element and update localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
        console.warn('Could not save theme to localStorage.');
    }
  }, [theme]);

  // Memoized toggle function to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return React.createElement(ThemeContext.Provider, { value: { theme, toggleTheme } }, children);
};

// The custom hook that components will use to access the theme state and toggle function
const useTheme = (): [Theme, () => void] => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return [context.theme, context.toggleTheme];
};

export default useTheme;