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
      <div className="container">
        <div className="header">
          <h1>🚀 Pokémon Analytics Dashboard</h1>
          <p>Interactive data visualization and analysis platform</p>
        </div>
        <div className="loading">Loading Pokémon data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="header">
          <h1>Pokémon Analytics Dashboard</h1>
          <p>Interactive data visualization and analysis platform</p>
        </div>
        <div className="error">{error}</div>
        <button onClick={loadPokemonData}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Pokémon Analytics Dashboard</h1>
        <p>Interactive data visualization and analysis platform</p>
      </div>

      {/* Sample data display - replace with your visualizations */}
      <div className="dashboard-grid">
        <div className="chart-container">
          <h3 className="chart-title">Data Loaded Successfully!</h3>
          <p>Found {pokemonData.length} Pokémon</p>

          {/* Example data structure preview */}
          <details style={{ marginTop: '1rem' }}>
            <summary>Sample Data Structure (click to expand)</summary>
            <pre
              style={{
                fontSize: '0.8rem',
                overflow: 'auto',
                background: '#f8f9fa',
                padding: '1rem',
                borderRadius: '4px',
                marginTop: '0.5rem',
              }}
            >
              {JSON.stringify(pokemonData[0], null, 2)}
            </pre>
          </details>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Your Visualization Here</h3>
          <p>Replace this with your charts and interactive components</p>
          <ul style={{ marginTop: '1rem', listStyle: 'inside' }}>
            <li>Chart.js is already included</li>
            <li>Axios for API calls</li>
            <li>Basic responsive CSS provided</li>
            <li>Error handling scaffolded</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
