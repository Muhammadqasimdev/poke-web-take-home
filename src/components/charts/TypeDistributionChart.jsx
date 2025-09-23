import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import { getTypeColor } from '../../utils/dataTransformers';

const TypeDistributionChart = ({
  data,
  title = 'Pokémon Type Distribution',
}) => {
  const { current: theme, isDarkMode } = useTheme();
  const [chartType, setChartType] = useState('bar');
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className={`${theme.cardBg} p-3 ${theme.border} border rounded-lg ${theme.shadow}`}
        >
          <p className={`font-medium ${theme.text}`}>{label || data.type}</p>
          <p className="text-blue-500 dark:text-blue-400">
            Count: <span className="font-semibold">{data.count}</span>
          </p>
          <p className={`${theme.textSecondary} text-sm`}>
            {((data.count / data.total) * 100).toFixed(1)}% of all types
          </p>
        </div>
      );
    }
    return null;
  };

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const enrichedData = data.map(item => ({
    ...item,
    total: totalCount,
    percentage: ((item.count / totalCount) * 100).toFixed(1),
  }));

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={enrichedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDarkMode ? '#374151' : '#f0f0f0'}
        />
        <XAxis
          dataKey="type"
          angle={-45}
          textAnchor="end"
          height={60}
          tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: isDarkMode ? '#d1d5db' : '#374151' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="count"
          fill={entry => getTypeColor(entry.type, isDarkMode)}
          radius={[4, 4, 0, 0]}
        >
          {enrichedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getTypeColor(entry.type, isDarkMode)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={enrichedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ type, percentage }) => `${type} (${percentage}%)`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="count"
          labelStyle={{
            fill: isDarkMode ? '#d1d5db' : '#374151',
            fontSize: 12,
          }}
        >
          {enrichedData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getTypeColor(entry.type, isDarkMode)}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">
          {title}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              chartType === 'bar'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              chartType === 'pie'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800'
            }`}
          >
            Pie Chart
          </button>
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
          key={chartType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {chartType === 'bar' ? renderBarChart() : renderPieChart()}
        </motion.div>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data.length}</div>
          <div className="text-sm text-gray-600">Unique Types</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalCount}</div>
          <div className="text-sm text-gray-600">Total Pokémon</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {data[0]?.type || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Most Common</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {data[0]?.count || 0}
          </div>
          <div className="text-sm text-gray-600">Highest Count</div>
        </div>
      </div>
    </motion.div>
  );
};

export default TypeDistributionChart;
