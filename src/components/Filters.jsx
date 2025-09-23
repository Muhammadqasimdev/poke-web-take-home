import { motion } from 'framer-motion';
import { getTypeColor } from '../utils/dataTransformers';

const Filters = ({
  filters,
  onFiltersChange,
  availableTypes,
  pokemonCount,
}) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      type: 'all',
      search: '',
      minStats: '',
    });
  };

  const hasActiveFilters =
    filters.type !== 'all' || filters.search || filters.minStats;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 lg:mb-0">
          Filter Pokémon
        </h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {pokemonCount} Pokémon
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search by Name
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            placeholder="Enter Pokémon name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={filters.type}
            onChange={e => handleFilterChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {availableTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Total Stats
          </label>
          <input
            type="number"
            value={filters.minStats}
            onChange={e =>
              handleFilterChange(
                'minStats',
                e.target.value ? parseInt(e.target.value) : ''
              )
            }
            placeholder="e.g. 400"
            min="0"
            max="800"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filters.type !== 'all' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active type filter:</span>
            <div
              className="px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-2"
              style={{ backgroundColor: getTypeColor(filters.type) }}
            >
              {filters.type.charAt(0).toUpperCase() + filters.type.slice(1)}
              <button
                onClick={() => handleFilterChange('type', 'all')}
                className="text-white hover:text-gray-200 ml-1"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Filters;
