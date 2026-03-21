const buildUrlAndParams = require('../utils/buildUrl');

class Game {
  /**
   * @param {R6Client} client - The main client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get Rainbow Six Siege game stats for all platform
   * @returns {Promise<Object>} - Game stats for all platform
   */
  async getGameStats() {
    try {
      const params = { type: 'gameStats' };
      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the game stats request:', error.message);
      if (error.response && error.response.status === 401) {
        throw new Error('request error');
      }
      throw error;
    }
  }

  async getMaps({ name, location, releaseDate, playlists, mapReworked } = {}) {
    try {
      const url = buildUrlAndParams('/maps', { name, location, releaseDate, playlists, mapReworked });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getMaps request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  async getOperators({ name, safename, realname, birthplace, age, date_of_birth, season_introduced, health, speed, unit, country_code, roles, side } = {}) {
    try {
      const url = buildUrlAndParams('/operators', { name, safename, realname, birthplace, age, date_of_birth, season_introduced, health, speed, unit, country_code, roles, side });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getOperators request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  async getRanks({ name, min_mmr, max_mmr, version } = {}) {
    try {
      if (version && !['v1', 'v2', 'v3', 'v4', 'v5', 'v6'].includes(version)) {
        throw new Error('Version not valid. Choose between v1, v2, v3, v4, v5, and v6.');
      }
      const url = buildUrlAndParams('/ranks', { name, min_mmr, max_mmr, version });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getRanks request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  async getSeasons({ name, map, operators, weapons, description, code, startDate } = {}) {
    try {
      const url = buildUrlAndParams('/seasons', { name, map, operators, weapons, description, code, startDate });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getSeasons request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  async getWeapons({ name } = {}) {
    try {
      const url = buildUrlAndParams('/weapons', { name });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getWeapons request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  async getCharms({ name, collection, rarity, availability, bundle, season } = {}) {
    try {
      const url = buildUrlAndParams('/charms', { name, collection, rarity, availability, bundle, season });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Errore during the getCharms request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  async getUniversalSkins({ name } = {}) {
    try {
      const url = buildUrlAndParams('/universalSkins', { name });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getUniversalSkins request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  async getAttachment({ name, style, rarity, availability, bundle, season } = {}) {
    try {
      const url = buildUrlAndParams('/attachment', { name, style, rarity, availability, bundle, season });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getAttachment request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

  /**
   * Search across all R6 entities (operators, weapons, maps, etc.)
   * @param {string} query - The search term to query across all entities
   * @returns {Promise<Object>} - Search results organized by entity type
   */
  async getSearchAll(query) {
    if (!query || typeof query !== 'string') {
      throw new Error('Search query is required and must be a string');
    }
    try {
      const url = buildUrlAndParams('/searchAll', { q: query });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getSearchAll request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('Authentication error');
      throw error;
    }
  }

  async getServiceStatus() {
    try {
      const url = '/serviceStatus';
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the service status request:', error.message);
      if (error.response && error.response.status === 401) throw new Error('request error');
      throw error;
    }
  }

}

module.exports = Game;
