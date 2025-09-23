import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  exportToCSV,
  exportToJSON,
  exportChartData,
  exportFilteredPokemon,
  exportSummaryStats,
} from '../utils/exportUtils';

const ExportButton = ({
  data,
  type = 'pokemon',
  chartType = null,
  filters = {},
  className = '',
}) => {
  const { current: theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async format => {
    setIsExporting(true);

    try {
      switch (type) {
        case 'pokemon':
          if (format === 'csv') {
            exportFilteredPokemon(data, filters);
          } else {
            exportToJSON(
              data,
              `pokemon-data-${new Date().toISOString().split('T')[0]}.json`
            );
          }
          break;

        case 'chart':
          exportChartData(data, chartType);
          break;

        case 'summary':
          exportSummaryStats(data);
          break;

        default:
          if (format === 'csv') {
            exportToCSV(data);
          } else {
            exportToJSON(data);
          }
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const exportOptions = [
    {
      label: 'Export as CSV',
      format: 'csv',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      label: 'Export as JSON',
      format: 'json',
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  if (type === 'summary') {
    return (
      <button
        onClick={() => handleExport('json')}
        disabled={
          isExporting || !data || (Array.isArray(data) && data.length === 0)
        }
        className={`
          flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${theme.cardBg} ${theme.text} hover:bg-blue-50 dark:hover:bg-gray-700
          ${theme.border} border ${theme.shadow}
          ${className}
        `}
        title="Export Summary Statistics"
      >
        {isExporting ? (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        )}
        {isExporting ? 'Exporting...' : 'Export Stats'}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={
          isExporting || !data || (Array.isArray(data) && data.length === 0)
        }
        className={`
          flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          ${theme.cardBg} ${theme.text} hover:bg-blue-50 dark:hover:bg-gray-700
          ${theme.border} border ${theme.shadow}
          ${className}
        `}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        Export Data
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute top-full left-0 mt-2 w-48 ${theme.cardBg} ${theme.shadow} 
              ${theme.border} border rounded-lg py-2 z-50
            `}
          >
            {exportOptions.map(option => (
              <button
                key={option.format}
                onClick={() => handleExport(option.format)}
                disabled={isExporting}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-sm ${theme.text}
                  hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default ExportButton;
