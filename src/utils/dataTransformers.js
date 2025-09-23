export const transformPokemonData = pokemonList => {
  return pokemonList.map(pokemon => ({
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map(type => type.type.name),
    primaryType: pokemon.types[0]?.type.name || 'unknown',
    stats: {
      hp: pokemon.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
      attack:
        pokemon.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
      defense:
        pokemon.stats.find(stat => stat.stat.name === 'defense')?.base_stat ||
        0,
      'special-attack':
        pokemon.stats.find(stat => stat.stat.name === 'special-attack')
          ?.base_stat || 0,
      'special-defense':
        pokemon.stats.find(stat => stat.stat.name === 'special-defense')
          ?.base_stat || 0,
      speed:
        pokemon.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0,
    },
    totalStats: pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0),
    height: pokemon.height,
    weight: pokemon.weight,
    sprite:
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default ||
      null,
    abilities: pokemon.abilities?.map(ability => ability.ability.name) || [],
    base_experience: pokemon.base_experience || 0,
    generation: getGenerationFromId(pokemon.id),
  }));
};

export const getGenerationFromId = id => {
  if (id <= 151) return 1;
  if (id <= 251) return 2;
  if (id <= 386) return 3;
  if (id <= 493) return 4;
  if (id <= 649) return 5;
  if (id <= 721) return 6;
  if (id <= 809) return 7;
  if (id <= 905) return 8;
  return 9;
};

export const getTypeDistribution = pokemonData => {
  const typeCount = {};

  pokemonData.forEach(pokemon => {
    pokemon.types.forEach(type => {
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
  });

  return Object.entries(typeCount)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
};

export const getStatAnalysis = pokemonData => {
  return pokemonData.map(pokemon => ({
    name: pokemon.name,
    id: pokemon.id,
    hp: pokemon.stats.hp,
    attack: pokemon.stats.attack,
    defense: pokemon.stats.defense,
    specialAttack: pokemon.stats.specialAttack,
    specialDefense: pokemon.stats.specialDefense,
    speed: pokemon.stats.speed,
    total: pokemon.totalStats,
    primaryType: pokemon.primaryType,
  }));
};

export const getHeightWeightCorrelation = pokemonData => {
  return pokemonData.map(pokemon => ({
    name: pokemon.name,
    id: pokemon.id,
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    primaryType: pokemon.primaryType,
    totalStats: pokemon.totalStats,
  }));
};

export const getGenerationTrends = pokemonData => {
  const generationStats = {};

  pokemonData.forEach(pokemon => {
    const gen = pokemon.generation;
    if (!generationStats[gen]) {
      generationStats[gen] = {
        generation: gen,
        count: 0,
        totalHP: 0,
        totalAttack: 0,
        totalDefense: 0,
        totalSpecialAttack: 0,
        totalSpecialDefense: 0,
        totalSpeed: 0,
        totalStats: 0,
      };
    }

    const genData = generationStats[gen];
    genData.count++;
    genData.totalHP += pokemon.stats.hp;
    genData.totalAttack += pokemon.stats.attack;
    genData.totalDefense += pokemon.stats.defense;
    genData.totalSpecialAttack += pokemon.stats.specialAttack;
    genData.totalSpecialDefense += pokemon.stats.specialDefense;
    genData.totalSpeed += pokemon.stats.speed;
    genData.totalStats += pokemon.totalStats;
  });

  return Object.values(generationStats)
    .map(gen => ({
      generation: gen.generation,
      avgHP: Math.round(gen.totalHP / gen.count),
      avgAttack: Math.round(gen.totalAttack / gen.count),
      avgDefense: Math.round(gen.totalDefense / gen.count),
      avgSpecialAttack: Math.round(gen.totalSpecialAttack / gen.count),
      avgSpecialDefense: Math.round(gen.totalSpecialDefense / gen.count),
      avgSpeed: Math.round(gen.totalSpeed / gen.count),
      avgTotal: Math.round(gen.totalStats / gen.count),
      count: gen.count,
    }))
    .sort((a, b) => a.generation - b.generation);
};

export const filterPokemonData = (pokemonData, filters) => {
  return pokemonData.filter(pokemon => {
    if (filters.type && filters.type !== 'all') {
      if (!pokemon.types.includes(filters.type)) {
        return false;
      }
    }

    if (filters.search) {
      if (!pokemon.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
    }

    if (filters.minStats && pokemon.totalStats < filters.minStats) {
      return false;
    }

    return true;
  });
};

export const getUniqueTypes = pokemonData => {
  const types = new Set();
  pokemonData.forEach(pokemon => {
    pokemon.types.forEach(type => types.add(type));
  });
  return Array.from(types).sort();
};

export const getUniqueGenerations = pokemonData => {
  const generations = new Set();
  pokemonData.forEach(pokemon => {
    generations.add(pokemon.generation);
  });
  return Array.from(generations).sort((a, b) => a - b);
};

export const typeColors = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const typeColorsDark = {
  normal: '#C4C4A4',
  fire: '#FF9C5A',
  water: '#8AB4FF',
  electric: '#FFE55A',
  grass: '#9AE070',
  ice: '#B8E8E8',
  fighting: '#E04848',
  poison: '#C060C0',
  ground: '#F0D088',
  flying: '#C8B0FF',
  psychic: '#FF88A8',
  bug: '#C8D840',
  rock: '#D8C058',
  ghost: '#9078B8',
  dragon: '#9058FF',
  dark: '#907868',
  steel: '#D8D8F0',
  fairy: '#FFB9CC',
};

export const colorSchemes = {
  default: [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#F97316',
    '#06B6D4',
    '#84CC16',
  ],
  pokemon: [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
  ],
  pastel: [
    '#FFB3BA',
    '#BAFFC9',
    '#BAE1FF',
    '#FFFFBA',
    '#FFD1BA',
    '#E1BAFF',
    '#C9FFE5',
    '#FFC9BA',
  ],
  vibrant: [
    '#FF3366',
    '#33CCFF',
    '#66FF33',
    '#FFCC33',
    '#CC33FF',
    '#FF6633',
    '#33FFCC',
    '#CCFF33',
  ],
  fire: [
    '#FF4500',
    '#FF6347',
    '#FF7F50',
    '#FFA500',
    '#FFB347',
    '#FFC649',
    '#FFD700',
    '#FFFF00',
  ],
  water: [
    '#0066CC',
    '#3399FF',
    '#66B2FF',
    '#99CCFF',
    '#CCE5FF',
    '#87CEEB',
    '#87CEFA',
    '#B0E0E6',
  ],
  grass: [
    '#228B22',
    '#32CD32',
    '#90EE90',
    '#98FB98',
    '#ADFF2F',
    '#7CFC00',
    '#7FFF00',
    '#9ACD32',
  ],
  electric: [
    '#FFD700',
    '#FFFF00',
    '#FFFF33',
    '#FFFF66',
    '#FFFF99',
    '#F0E68C',
    '#BDB76B',
    '#DAA520',
  ],
};

export const getTypeColor = (type, isDarkMode = false) => {
  const colors = isDarkMode ? typeColorsDark : typeColors;
  return colors[type] || (isDarkMode ? '#8AB4A4' : '#68A090');
};

export const getColorScheme = (schemeName = 'default') => {
  return colorSchemes[schemeName] || colorSchemes.default;
};

export const generateTypeBasedColorScheme = pokemonData => {
  const typeDistribution = getTypeDistribution(pokemonData);
  return typeDistribution.map(item => getTypeColor(item.type));
};

export const generateStatBasedColors = pokemonData => {
  const statRanges = {
    low: '#EF4444',
    medium: '#F59E0B',
    high: '#10B981',
    legendary: '#8B5CF6',
  };

  return pokemonData.map(pokemon => {
    const totalStats = pokemon.totalStats;
    if (totalStats >= 600) return statRanges.legendary;
    if (totalStats >= 500) return statRanges.high;
    if (totalStats >= 400) return statRanges.medium;
    return statRanges.low;
  });
};

export const generateGenerationColors = pokemonData => {
  const generationColors = {
    1: '#FF6B6B',
    2: '#4ECDC4',
    3: '#45B7D1',
    4: '#96CEB4',
    5: '#FFEAA7',
    6: '#DDA0DD',
    7: '#98D8C8',
    8: '#F7DC6F',
    9: '#FFB3BA',
  };

  return pokemonData.map(
    pokemon => generationColors[pokemon.generation] || '#68A090'
  );
};
