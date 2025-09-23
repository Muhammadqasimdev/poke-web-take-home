import axios from 'axios';

class PokemonApiService {
  constructor() {
    this.baseURL = 'https://pokeapi.co/api/v2';
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
  }

  async getPokemonList(limit = 151, offset = 0) {
    try {
      const response = await this.axiosInstance.get(
        `/pokemon?limit=${limit}&offset=${offset}`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching Pokemon list:', error);
      throw new Error('Failed to fetch Pokemon list');
    }
  }

  async getPokemonDetails(urlOrName) {
    try {
      const url =
        typeof urlOrName === 'string' && urlOrName.includes('http')
          ? urlOrName
          : `/pokemon/${urlOrName}`;

      const response = await this.axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
      throw new Error(`Failed to fetch Pokemon details for ${urlOrName}`);
    }
  }

  async getPokemonSpecies(id) {
    try {
      const response = await this.axiosInstance.get(`/pokemon-species/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Pokemon species:', error);
      throw new Error(`Failed to fetch Pokemon species for ${id}`);
    }
  }

  async getPokemonTypes() {
    try {
      const response = await this.axiosInstance.get('/type');
      return response.data;
    } catch (error) {
      console.error('Error fetching Pokemon types:', error);
      throw new Error('Failed to fetch Pokemon types');
    }
  }

  async getPokemonBatch(pokemonList, batchSize = 10) {
    const batches = [];
    for (let i = 0; i < pokemonList.length; i += batchSize) {
      batches.push(pokemonList.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      try {
        const batchPromises = batch.map(pokemon =>
          this.getPokemonDetails(pokemon.url || pokemon.name || pokemon)
        );
        const batchResults = await Promise.allSettled(batchPromises);

        const successfulResults = batchResults
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value);

        const errors = batchResults.filter(
          result => result.status === 'rejected'
        );

        if (errors.length > 0) {
          console.error(`${errors.length} requests failed in batch`);
        }

        results.push(...successfulResults);

        if (batches.indexOf(batch) < batches.length - 1) {
          await new Promise(resolve => globalThis.setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Batch request failed:', error);
      }
    }

    return results;
  }
}

export default new PokemonApiService();
