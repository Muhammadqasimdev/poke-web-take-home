import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Example API service - feel free to restructure however you prefer
const pokemonApi = {
  baseURL: 'https://pokeapi.co/api/v2',

  // Get basic pokemon list
  async getPokemonList(limit = 151) {
    const response = await axios.get(`${this.baseURL}/pokemon?limit=${limit}`);
    return response.data.results;
  },

  // Get detailed pokemon data
  async getPokemonDetails(urlOrName) {
    const response = await axios.get(
      typeof urlOrName === 'string' && urlOrName.includes('http')
        ? urlOrName
        : `${this.baseURL}/pokemon/${urlOrName}`
    );
    return response.data;
  },
};

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPokemonData();
  }, []);

  const loadPokemonData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Example: Load first 20 Pokemon with details
      const pokemonList = await pokemonApi.getPokemonList(20);

      // Fetch detailed data for each Pokemon
      // Note: Consider implementing batching/caching for better performance
      const detailedPokemon = await Promise.all(
        pokemonList.map(pokemon => pokemonApi.getPokemonDetails(pokemon.url))
      );

      setPokemonData(detailedPokemon);
    } catch (err) {
      setError('Failed to load Pokemon data. Please try again.');
      console.error('Error loading Pokemon data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🚀 Pokémon Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Interactive data visualization and analysis platform
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="bg-white rounded-lg shadow-md px-8 py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading Pokémon data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Pokémon Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Interactive data visualization and analysis platform
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="bg-white rounded-lg shadow-md px-8 py-6 text-center">
              <div className="text-red-500 text-lg mb-4">{error}</div>
              <button
                onClick={loadPokemonData}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Pokémon Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Interactive data visualization and analysis platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Data Loaded Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Found {pokemonData.length} Pokémon
            </p>

            <details className="mt-4">
              <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                Sample Data Structure (click to expand)
              </summary>
              <pre className="text-xs overflow-auto bg-gray-50 p-4 rounded-md mt-2 border">
                {JSON.stringify(pokemonData[0], null, 2)}
              </pre>
            </details>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Visualization Here
            </h3>
            <p className="text-gray-600 mb-4">
              Replace this with your charts and interactive components
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Chart.js is already included
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Axios for API calls
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Tailwind CSS now configured
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Error handling scaffolded
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
