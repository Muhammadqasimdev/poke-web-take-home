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
import {
  FileDownload,
  Description,
  DataObject,
  BarChart,
  ExpandMore,
} from '@mui/icons-material';

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
      icon: <Description className="w-4 h-4" />,
    },
    {
      label: 'Export as JSON',
      format: 'json',
      icon: <DataObject className="w-4 h-4" />,
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
          <BarChart className="w-4 h-4" />
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
        <FileDownload className="w-4 h-4" />
        Export Data
        <ExpandMore
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
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
