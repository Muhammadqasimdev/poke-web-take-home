import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pokemonDashboard-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem(
      'pokemonDashboard-theme',
      isDarkMode ? 'dark' : 'light'
    );

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      light: {
        bg: 'bg-gray-100',
        cardBg: 'bg-white',
        text: 'text-gray-800',
        textSecondary: 'text-gray-600',
        border: 'border-gray-200',
        shadow: 'shadow-md',
      },
      dark: {
        bg: 'bg-gray-900',
        cardBg: 'bg-gray-800',
        text: 'text-gray-100',
        textSecondary: 'text-gray-300',
        border: 'border-gray-700',
        shadow: 'shadow-lg shadow-gray-900/20',
      },
    },
    current: isDarkMode
      ? {
          bg: 'bg-gray-900',
          cardBg: 'bg-gray-800',
          text: 'text-gray-100',
          textSecondary: 'text-gray-300',
          border: 'border-gray-700',
          shadow: 'shadow-lg shadow-gray-900/20',
        }
      : {
          bg: 'bg-gray-100',
          cardBg: 'bg-white',
          text: 'text-gray-800',
          textSecondary: 'text-gray-600',
          border: 'border-gray-200',
          shadow: 'shadow-md',
        },
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
