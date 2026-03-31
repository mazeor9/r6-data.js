const buildUrlAndParams = require('../utils/buildUrl');

/** @typedef {import('../R6Client')} R6Client */
/** @typedef {import('../../types/params-interfaces').GetMapsParams} GetMapsParams */
/** @typedef {import('../../types/params-interfaces').GetOperatorsParams} GetOperatorsParams */
/** @typedef {import('../../types/params-interfaces').GetSeasonsParams} GetSeasonsParams */
/** @typedef {import('../../types/params-interfaces').GetAttachmentParams} GetAttachmentParams */
/** @typedef {import('../../types/params-interfaces').GetCharmsParams} GetCharmsParams */
/** @typedef {import('../../types/params-interfaces').GetWeaponsParams} GetWeaponsParams */
/** @typedef {import('../../types/params-interfaces').GetUniversalSkinsParams} GetUniversalSkinsParams */
/** @typedef {import('../../types/params-interfaces').GetRanksParams} GetRanksParams */

/**
 * @typedef {Error & {
 *   response?: {
 *     status?: number,
 *     data?: any,
 *     headers?: Record<string, string>
 *   }
 * }} HttpClientError
 */

/**
 * @param {unknown} error
 * @returns {HttpClientError}
 */
function asHttpError(error) {
  return /** @type {HttpClientError} */ (error);
}

class Game {
  /**
   * @param {R6Client} client - The main client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get Rainbow Six Siege game stats for all platforms.
   * @returns {Promise<any>}
   */
  async getGameStats() {
    try {
      const url = buildUrlAndParams('/stats', { type: 'gameStats' });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the game stats request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('request error');
      }
      throw err;
    }
  }

  /**
   * @param {GetMapsParams} [params={}]
   * @returns {Promise<any[]>}
   */
  async getMaps({ name, location, releaseDate, playlists, mapReworked } = {}) {
    try {
      const url = buildUrlAndParams('/maps', { name, location, releaseDate, playlists, mapReworked });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getMaps request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * @param {GetOperatorsParams & {
   *   health?: number | string,
   *   speed?: number | string,
   *   unit?: string,
   *   country_code?: string,
   *   roles?: string,
   *   side?: string
   * }} [params={}]
   * @returns {Promise<any[]>}
   */
  async getOperators({ name, safename, realname, birthplace, age, date_of_birth, season_introduced, health, speed, unit, country_code, roles, side } = {}) {
    try {
      const url = buildUrlAndParams('/operators', { name, safename, realname, birthplace, age, date_of_birth, season_introduced, health, speed, unit, country_code, roles, side });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getOperators request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * @param {GetRanksParams & { name?: string }} [params={}]
   * @returns {Promise<any[]>}
   */
  async getRanks({ name, min_mmr, max_mmr, version } = {}) {
    try {
      if (version && !['v1', 'v2', 'v3', 'v4', 'v5', 'v6'].includes(version)) {
        throw new Error('Version not valid. Choose between v1, v2, v3, v4, v5, and v6.');
      }
      const url = buildUrlAndParams('/ranks', { name, min_mmr, max_mmr, version });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getRanks request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * @param {GetSeasonsParams & { description?: string, code?: string, startDate?: string }} [params={}]
   * @returns {Promise<any[]>}
   */
  async getSeasons({ name, map, operators, weapons, description, code, startDate } = {}) {
    try {
      const url = buildUrlAndParams('/seasons', { name, map, operators, weapons, description, code, startDate });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getSeasons request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * @param {GetWeaponsParams} [params={}]
   * @returns {Promise<any[]>}
   */
  async getWeapons({ name } = {}) {
    try {
      const url = buildUrlAndParams('/weapons', { name });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getWeapons request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * @param {GetCharmsParams} [params={}]
   * @returns {Promise<any[]>}
   */
  async getCharms({ name, collection, rarity, availability, bundle, season } = {}) {
    try {
      const url = buildUrlAndParams('/charms', { name, collection, rarity, availability, bundle, season });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getCharms request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * @param {GetUniversalSkinsParams} [params={}]
   * @returns {Promise<any[]>}
   */
  async getUniversalSkins({ name } = {}) {
    try {
      const url = buildUrlAndParams('/universalSkins', { name });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getUniversalSkins request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * @param {GetAttachmentParams & { bundle?: string, season?: string }} [params={}]
   * @returns {Promise<any[]>}
   */
  async getAttachment({ name, style, rarity, availability, bundle, season } = {}) {
    try {
      const url = buildUrlAndParams('/attachment', { name, style, rarity, availability, bundle, season });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getAttachment request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }

  /**
   * Search across all R6 entities (operators, weapons, maps, etc.)
   * @param {string} query - The search term to query across all entities
   * @returns {Promise<any>}
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
      const err = asHttpError(error);
      console.error('Error during the getSearchAll request:', err.message);
      if (err.response?.status === 401) throw new Error('Authentication error');
      throw err;
    }
  }

  /**
   * @returns {Promise<any>}
   */
  async getServiceStatus() {
    try {
      const response = await this.client.httpClient.get('/serviceStatus');
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the service status request:', err.message);
      if (err.response?.status === 401) throw new Error('request error');
      throw err;
    }
  }
}

module.exports = Game;
