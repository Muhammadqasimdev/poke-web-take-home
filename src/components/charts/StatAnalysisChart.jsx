import { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getTypeColor } from '../../utils/dataTransformers';

const StatAnalysisChart = ({ data, title = 'Pokémon Stat Analysis' }) => {
  const { current: theme, isDarkMode } = useTheme();
  const [xAxis, setXAxis] = useState('attack');
  const [yAxis, setYAxis] = useState('defense');

  const statOptions = [
    { value: 'hp', label: 'HP' },
    { value: 'attack', label: 'Attack' },
    { value: 'defense', label: 'Defense' },
    { value: 'specialAttack', label: 'Sp. Attack' },
    { value: 'specialDefense', label: 'Sp. Defense' },
    { value: 'speed', label: 'Speed' },
    { value: 'total', label: 'Total Stats' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`${theme.cardBg} p-3 ${theme.border} border rounded-lg ${theme.shadow} max-w-xs`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: getTypeColor(data.primaryType, isDarkMode),
              }}
            />
            <p className={`font-medium ${theme.text} capitalize`}>
              {data.name}
            </p>
          </div>
          <div className="space-y-1 text-sm">
            <p className={theme.textSecondary}>
              Type:{' '}
              <span
                className="font-medium"
                style={{ color: getTypeColor(data.primaryType, isDarkMode) }}
              >
                {data.primaryType}
              </span>
            </p>
            <p>
              HP: <span className="font-medium">{data.hp}</span>
            </p>
            <p>
              Attack: <span className="font-medium">{data.attack}</span>
            </p>
            <p>
              Defense: <span className="font-medium">{data.defense}</span>
            </p>
            <p>
              Sp. Attack:{' '}
              <span className="font-medium">{data.specialAttack}</span>
            </p>
            <p>
              Sp. Defense:{' '}
              <span className="font-medium">{data.specialDefense}</span>
            </p>
            <p>
              Speed: <span className="font-medium">{data.speed}</span>
            </p>
            <p className="border-t pt-1 mt-1">
              Total: <span className="font-bold">{data.total}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderScatterChart = () => {
    const typeGroups = data.reduce((acc, pokemon) => {
      if (!acc[pokemon.primaryType]) {
        acc[pokemon.primaryType] = [];
      }
      acc[pokemon.primaryType].push(pokemon);
      return acc;
    }, {});

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDarkMode ? '#374151' : '#f0f0f0'}
          />
          <XAxis
            type="number"
            dataKey={xAxis}
            name={statOptions.find(s => s.value === xAxis)?.label}
            tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }}
          />
          <YAxis
            type="number"
            dataKey={yAxis}
            name={statOptions.find(s => s.value === yAxis)?.label}
            tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {Object.entries(typeGroups).map(([type, pokemon]) => (
            <Scatter
              key={type}
              name={type}
              data={pokemon}
              fill={getTypeColor(type, isDarkMode)}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-0">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            X-Axis
          </label>
          <select
            value={xAxis}
            onChange={e => setXAxis(e.target.value)}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y-Axis
          </label>
          <select
            value={yAxis}
            onChange={e => setYAxis(e.target.value)}
            className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p>No data available</p>
          </div>
        </div>
      ) : (
        <motion.div
          key={`${xAxis}-${yAxis}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderScatterChart()}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StatAnalysisChart;
