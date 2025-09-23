import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import pokemonApi from '../services/pokemonApi';
import {
  transformPokemonData,
  getTypeDistribution,
  getStatAnalysis,
  getHeightWeightCorrelation,
  filterPokemonData,
  getUniqueTypes,
} from '../utils/dataTransformers';
import Filters from './Filters';
import TypeDistributionChart from './charts/TypeDistributionChart';
import StatAnalysisChart from './charts/StatAnalysisChart';
import HeightWeightChart from './charts/HeightWeightChart';
import ThemeToggle from './ThemeToggle';
import ExportButton from './ExportButton';

const Dashboard = () => {
  const { current: theme } = useTheme();
  const [transformedData, setTransformedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    minStats: '',
  });

  const [availableTypes, setAvailableTypes] = useState([]);

  useEffect(() => {
    loadPokemonData();
  }, []);

  useEffect(() => {
    if (transformedData.length > 0) {
      const filtered = filterPokemonData(transformedData, filters);
      setFilteredData(filtered);
    }
  }, [transformedData, filters]);

  const loadPokemonData = async () => {
    try {
      const pokemonList = await pokemonApi.getPokemonList(151);
      const detailedPokemon = await pokemonApi.getPokemonBatch(pokemonList, 15);
      const transformed = transformPokemonData(detailedPokemon);

      setTransformedData(transformed);
      setFilteredData(transformed);
      setAvailableTypes(getUniqueTypes(transformed));
    } catch (err) {
      console.error('Error loading Pokemon data:', err);
    }
  };

  const handleFiltersChange = newFilters => {
    setFilters(newFilters);
  };

  const typeDistribution = getTypeDistribution(filteredData);
  const statAnalysis = getStatAnalysis(filteredData);
  const heightWeightData = getHeightWeightCorrelation(filteredData);

  return (
    <div className={`min-h-screen ${theme.bg} py-8`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center flex-1"
          >
            <h1 className={`text-4xl font-bold ${theme.text} mb-2`}>
              Pokémon Analytics Dashboard
            </h1>
            <p className={theme.textSecondary}>
              Interactive data visualization and analysis platform
            </p>
          </motion.div>
          <ThemeToggle className="ml-4" />
        </div>

        <Filters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableTypes={availableTypes}
          pokemonCount={filteredData.length}
        />

        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <ExportButton
            data={filteredData}
            type="pokemon"
            filters={filters}
            className="flex-shrink-0"
          />
          <ExportButton
            data={filteredData}
            type="summary"
            className="flex-shrink-0"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <TypeDistributionChart
            data={typeDistribution}
            title="Type Distribution"
          />
          <StatAnalysisChart data={statAnalysis} title="Stat Analysis" />
        </div>

        <div className="mb-6">
          <HeightWeightChart
            data={heightWeightData}
            title="Height vs Weight Correlation"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <div
            className={`${theme.cardBg} rounded-lg ${theme.shadow} p-6 text-center`}
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {filteredData.length}
            </div>
            <div className={theme.textSecondary}>Pokémon Analyzed</div>
          </div>

          <div
            className={`${theme.cardBg} rounded-lg ${theme.shadow} p-6 text-center`}
          >
            <div className="text-3xl font-bold text-green-600 mb-2">
              {availableTypes.length}
            </div>
            <div className={theme.textSecondary}>Unique Types</div>
          </div>

          <div
            className={`${theme.cardBg} rounded-lg ${theme.shadow} p-6 text-center`}
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {filteredData.length > 0
                ? Math.round(
                    filteredData.reduce((sum, p) => sum + p.totalStats, 0) /
                      filteredData.length
                  )
                : 0}
            </div>
            <div className={theme.textSecondary}>Avg Total Stats</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
