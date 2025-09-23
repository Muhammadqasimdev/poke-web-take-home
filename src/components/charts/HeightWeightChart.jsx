import { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getTypeColor } from '../../utils/dataTransformers';

const HeightWeightChart = ({
  data,
  title = 'Pokémon Height vs Weight Analysis',
}) => {
  const { current: theme, isDarkMode } = useTheme();
  const [showTrendLine, setShowTrendLine] = useState(false);
  const [colorBy, setColorBy] = useState('type');

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`${theme.cardBg} p-3 ${theme.border} border rounded-lg ${theme.shadow}`}
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
              Height: <span className="font-medium">{data.height}m</span>
            </p>
            <p>
              Weight: <span className="font-medium">{data.weight}kg</span>
            </p>
            <p>
              Total Stats:{' '}
              <span className="font-medium">{data.totalStats}</span>
            </p>
            <p className="text-xs text-gray-600">
              BMI: {(data.weight / (data.height * data.height)).toFixed(1)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const calculateCorrelation = () => {
    const n = data.length;
    const sumX = data.reduce((sum, p) => sum + p.height, 0);
    const sumY = data.reduce((sum, p) => sum + p.weight, 0);
    const sumXY = data.reduce((sum, p) => sum + p.height * p.weight, 0);
    const sumX2 = data.reduce((sum, p) => sum + p.height * p.height, 0);
    const sumY2 = data.reduce((sum, p) => sum + p.weight * p.weight, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY)
    );

    return denominator === 0 ? 0 : numerator / denominator;
  };

  const generateTrendLine = () => {
    const n = data.length;
    const sumX = data.reduce((sum, p) => sum + p.height, 0);
    const sumY = data.reduce((sum, p) => sum + p.weight, 0);
    const sumXY = data.reduce((sum, p) => sum + p.height * p.weight, 0);
    const sumX2 = data.reduce((sum, p) => sum + p.height * p.height, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const minHeight = Math.min(...data.map(p => p.height));
    const maxHeight = Math.max(...data.map(p => p.height));

    return [
      { height: minHeight, weight: slope * minHeight + intercept },
      { height: maxHeight, weight: slope * maxHeight + intercept },
    ];
  };

  const getGroupedData = () => {
    if (colorBy === 'type') {
      return data.reduce((acc, pokemon) => {
        if (!acc[pokemon.primaryType]) {
          acc[pokemon.primaryType] = [];
        }
        acc[pokemon.primaryType].push(pokemon);
        return acc;
      }, {});
    } else {
      return data.reduce((acc, pokemon) => {
        let group;
        if (pokemon.totalStats < 400) group = 'Low Stats (< 400)';
        else if (pokemon.totalStats < 500) group = 'Medium Stats (400-500)';
        else if (pokemon.totalStats < 600) group = 'High Stats (500-600)';
        else group = 'Legendary Stats (600+)';

        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(pokemon);
        return acc;
      }, {});
    }
  };

  const groupedData = getGroupedData();
  const correlation = calculateCorrelation();
  const trendLineData = generateTrendLine();

  const statGroupColors = {
    'Low Stats (< 400)': '#94a3b8',
    'Medium Stats (400-500)': '#3b82f6',
    'High Stats (500-600)': '#f59e0b',
    'Legendary Stats (600+)': '#dc2626',
  };

  const getGroupColor = group => {
    if (colorBy === 'type') {
      return getTypeColor(group, isDarkMode);
    }
    return statGroupColors[group] || '#6b7280';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 lg:mb-0">
          {title}
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Color by:
            </label>
            <select
              value={colorBy}
              onChange={e => setColorBy(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="type">Type</option>
              <option value="stats">Stat Range</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showTrendLine}
              onChange={e => setShowTrendLine(e.target.checked)}
              className="rounded"
            />
            Show Trend Line
          </label>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p>No data available</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDarkMode ? '#374151' : '#f0f0f0'}
            />
            <XAxis
              type="number"
              dataKey="height"
              name="Height"
              unit="m"
              tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }}
              label={{
                value: 'Height (m)',
                position: 'insideBottom',
                offset: -10,
                style: { fill: isDarkMode ? '#d1d5db' : '#374151' },
              }}
            />
            <YAxis
              type="number"
              dataKey="weight"
              name="Weight"
              unit="kg"
              tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }}
              label={{
                value: 'Weight (kg)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: isDarkMode ? '#d1d5db' : '#374151' },
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {Object.entries(groupedData).map(([group, pokemon]) => (
              <Scatter
                key={group}
                name={group}
                data={pokemon}
                fill={getGroupColor(group)}
              />
            ))}

            {showTrendLine && (
              <Line
                type="monotone"
                dataKey="weight"
                data={trendLineData}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls={false}
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {correlation.toFixed(3)}
          </div>
          <div className="text-sm text-gray-600">Correlation</div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.abs(correlation) > 0.7
              ? 'Strong'
              : Math.abs(correlation) > 0.3
                ? 'Moderate'
                : 'Weak'}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {data.length > 0
              ? (
                  data.reduce((sum, p) => sum + p.height, 0) / data.length
                ).toFixed(1)
              : '0'}
            m
          </div>
          <div className="text-sm text-gray-600">Avg Height</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data.length > 0
              ? (
                  data.reduce((sum, p) => sum + p.weight, 0) / data.length
                ).toFixed(1)
              : '0'}
            kg
          </div>
          <div className="text-sm text-gray-600">Avg Weight</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data.length}
          </div>
          <div className="text-sm text-gray-600">Total Pokémon</div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeightWeightChart;
