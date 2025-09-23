export const exportToCSV = (data, filename = 'pokemon-data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);

  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers
        .map(header => {
          const value = row[header];
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          if (typeof value === 'object' && value !== null) {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        })
        .join(',')
    ),
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToJSON = (data, filename = 'pokemon-data.json') => {
  if (!data) {
    console.warn('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

export const exportChartData = (chartData, chartType, filename) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const defaultFilename = `pokemon-${chartType}-${timestamp}`;

  switch (chartType) {
    case 'type-distribution':
      exportToCSV(chartData, `${filename || defaultFilename}.csv`);
      break;
    case 'stat-analysis':
      exportToJSON(chartData, `${filename || defaultFilename}.json`);
      break;
    case 'height-weight':
      exportToCSV(chartData, `${filename || defaultFilename}.csv`);
      break;
    default:
      exportToJSON(chartData, `${filename || defaultFilename}.json`);
  }
};

export const exportFilteredPokemon = (pokemonData, filters) => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filterSummary = Object.entries(filters)
    .filter(([_, value]) => value && value !== 'all' && value !== '')
    .map(([key, value]) => `${key}-${value}`)
    .join('_');

  const filename = `pokemon-filtered${filterSummary ? '-' + filterSummary : ''}-${timestamp}.csv`;

  const flattenedData = pokemonData.map(pokemon => ({
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.join(', '),
    height: pokemon.height,
    weight: pokemon.weight,
    base_experience: pokemon.base_experience,
    hp: pokemon.stats.hp,
    attack: pokemon.stats.attack,
    defense: pokemon.stats.defense,
    special_attack: pokemon.stats['special-attack'],
    special_defense: pokemon.stats['special-defense'],
    speed: pokemon.stats.speed,
    total_stats: pokemon.totalStats,
    abilities: pokemon.abilities.join(', '),
    generation: pokemon.generation || 'Unknown',
  }));

  exportToCSV(flattenedData, filename);
};

const downloadFile = (content, filename, mimeType) => {
  if (typeof window === 'undefined' || !window.Blob) {
    console.warn('File download not supported in this environment');
    return;
  }

  const blob = new window.Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => window.URL.revokeObjectURL(url), 100);
};

export const exportSummaryStats = data => {
  const stats = {
    total_pokemon: data.length,
    unique_types: [...new Set(data.flatMap(p => p.types))].length,
    average_height: (
      data.reduce((sum, p) => sum + p.height, 0) / data.length
    ).toFixed(2),
    average_weight: (
      data.reduce((sum, p) => sum + p.weight, 0) / data.length
    ).toFixed(2),
    average_base_experience: Math.round(
      data.reduce((sum, p) => sum + (p.base_experience || 0), 0) / data.length
    ),
    type_distribution: data.reduce((acc, pokemon) => {
      pokemon.types.forEach(type => {
        acc[type] = (acc[type] || 0) + 1;
      });
      return acc;
    }, {}),
    stat_averages: {
      hp: Math.round(
        data.reduce((sum, p) => sum + p.stats.hp, 0) / data.length
      ),
      attack: Math.round(
        data.reduce((sum, p) => sum + p.stats.attack, 0) / data.length
      ),
      defense: Math.round(
        data.reduce((sum, p) => sum + p.stats.defense, 0) / data.length
      ),
      special_attack: Math.round(
        data.reduce((sum, p) => sum + p.stats['special-attack'], 0) /
          data.length
      ),
      special_defense: Math.round(
        data.reduce((sum, p) => sum + p.stats['special-defense'], 0) /
          data.length
      ),
      speed: Math.round(
        data.reduce((sum, p) => sum + p.stats.speed, 0) / data.length
      ),
    },
    generation_timestamp: new Date().toISOString(),
  };

  const timestamp = new Date().toISOString().split('T')[0];
  exportToJSON(stats, `pokemon-summary-stats-${timestamp}.json`);
};
