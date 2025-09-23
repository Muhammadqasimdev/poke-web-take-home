import { useTheme } from '../contexts/ThemeContext';
import { LightMode, DarkMode } from '@mui/icons-material';

const ThemeToggle = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center w-12 h-12 rounded-full 
        transition-all duration-300 ease-in-out
        ${
          isDarkMode
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300'
            : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
        }
        ${className}
      `}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <LightMode
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-90'
          }`}
        />
        <DarkMode
          className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
            isDarkMode ? 'opacity-0 -rotate-90' : 'opacity-100 rotate-0'
          }`}
        />
      </div>
    </button>
  );
};

export default ThemeToggle;
