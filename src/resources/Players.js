const buildUrlAndParams = require('../utils/buildUrl');

/** @typedef {import('../R6Client')} R6Client */
/** @typedef {import('../../types/base-types').BoardId} BoardId */
/** @typedef {import('../../types/base-types').PlatformFamily} PlatformFamily */
/** @typedef {import('../../types/base-types').PlatformType} PlatformType */
/** @typedef {import('../../types/params-interfaces').AccountInfoParams} AccountInfoParams */
/** @typedef {import('../../types/params-interfaces').GetIsBannedParams} GetIsBannedParams */
/** @typedef {import('../../types/params-interfaces').PlayerStatsParams} PlayerStatsParams */
/** @typedef {import('../../types/params-interfaces').SeasonalStatsParams} SeasonalStatsParams */
/** @typedef {import('../../types/params-interfaces').OperatorStatsParams} OperatorStatsParams */
/** @typedef {import('../../types/params-interfaces').PlayerComparisonsParams} PlayerComparisonsParams */

/**
 * @typedef {{
 *   nameOnPlatform: string,
 *   platformType: PlatformType
 * }} ComparisonPlayer
 */

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

/** @type {BoardId[]} */
const VALID_BOARD_IDS = ['casual', 'event', 'warmup', 'standard', 'ranked'];

/**
 * @param {BoardId | undefined} boardId
 */
function validateBoardId(boardId) {
  if (boardId && !VALID_BOARD_IDS.includes(boardId)) {
    throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
  }
}

/**
 * @param {any} data
 * @param {BoardId | undefined} boardId
 */
function filterBoardProfiles(data, boardId) {
  if (!boardId || !data?.platform_families_full_profiles) {
    return;
  }

  /** @type {any[]} */
  const profiles = data.platform_families_full_profiles;
  profiles.forEach((profile) => {
    if (Array.isArray(profile.board_ids_full_profiles)) {
      profile.board_ids_full_profiles = profile.board_ids_full_profiles.filter(
        /** @param {any} board */
        (board) => board.board_id === boardId
      );
    }
  });
}

class Players {
  /**
   * @param {R6Client} client - The main client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get Rainbow Six Siege player account information.
   * @param {AccountInfoParams} params
   * @returns {Promise<any>}
   */
  async getAccountInfo({ nameOnPlatform, platformType }) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      /** @type {{ type: 'accountInfo', nameOnPlatform: string, platformType: PlatformType }} */
      const params = {
        type: 'accountInfo',
        nameOnPlatform,
        platformType,
      };

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getAccountInfo request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      throw err;
    }
  }

  /**
   * Get Rainbow Six Siege player ban status.
   * @param {GetIsBannedParams} params
   * @returns {Promise<any>}
   */
  async getIsBanned({ nameOnPlatform, platformType }) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      /** @type {{ type: 'isBanned', nameOnPlatform: string, platformType: PlatformType }} */
      const params = {
        type: 'isBanned',
        nameOnPlatform,
        platformType,
      };

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getIsBanned request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      throw err;
    }
  }

  /**
   * Get Rainbow Six Siege player statistics.
   * @param {PlayerStatsParams} params
   * @returns {Promise<any>}
   */
  async getPlayerStats({ nameOnPlatform, platformType, platform_families, board_id }) {
    try {
      if (!nameOnPlatform || !platformType || !platform_families) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType, platform_families');
      }

      validateBoardId(board_id);

      /** @type {{ type: 'stats', nameOnPlatform: string, platformType: PlatformType, platform_families: PlatformFamily, board_id?: BoardId }} */
      const params = {
        type: 'stats',
        nameOnPlatform,
        platformType,
        platform_families,
      };

      if (board_id) {
        params.board_id = board_id;
      }

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      filterBoardProfiles(response.data, board_id);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getPlayerStats request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      throw err;
    }
  }

  /**
   * Compare Rainbow Six Siege player statistics between multiple players.
   * @param {PlayerComparisonsParams} params
   * @returns {Promise<{ comparisons: any[], errors?: Array<{ player: ComparisonPlayer, error: string }> }>}
   */
  async getPlayerComparisons({ players, platform_families, board_id }) {
    try {
      if (!players || !Array.isArray(players) || players.length < 2) {
        throw new Error('At least 2 players are required for comparison');
      }

      if (!platform_families) {
        throw new Error('Missing required parameter: platform_families');
      }

      players.forEach((player, index) => {
        if (!player.nameOnPlatform || !player.platformType) {
          throw new Error(`Player ${index + 1} is missing required fields: nameOnPlatform, platformType`);
        }
      });

      validateBoardId(board_id);

      /** @type {any[]} */
      const playerStats = [];
      /** @type {Array<{ player: ComparisonPlayer, error: string }>} */
      const errors = [];

      for (const player of players) {
        try {
          /** @type {{ type: 'stats', nameOnPlatform: string, platformType: PlatformType, platform_families: PlatformFamily, board_id?: BoardId }} */
          const params = {
            type: 'stats',
            nameOnPlatform: player.nameOnPlatform,
            platformType: player.platformType,
            platform_families,
          };

          if (board_id) {
            params.board_id = board_id;
          }

          const url = buildUrlAndParams('/stats', params);
          const response = await this.client.httpClient.get(url);
          filterBoardProfiles(response.data, board_id);

          if (response.data?.platform_families_full_profiles?.length > 0) {
            playerStats.push({ player, stats: response.data, success: true });
          } else {
            playerStats.push({ player, stats: null, success: false, error: 'No stats found for player' });
          }
        } catch (error) {
          const err = asHttpError(error);
          errors.push({ player, error: err.message });
          playerStats.push({ player, stats: null, success: false, error: err.message });
        }
      }

      return {
        comparisons: playerStats,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getPlayerComparisons request:', err.message);
      throw err;
    }
  }

  /**
   * Get Rainbow Six Siege player stats or account information.
   * @param {{ type: 'accountInfo' | 'stats', nameOnPlatform: string, platformType: PlatformType, platform_families?: PlatformFamily, board_id?: BoardId }} params
   * @returns {Promise<any>}
   */
  async getStats({ type, nameOnPlatform, platformType, platform_families, board_id }) {
    try {
      if (!type || !nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: type, nameOnPlatform, platformType');
      }

      if (type !== 'accountInfo' && type !== 'stats') {
        throw new Error('Invalid type parameter. Must be "accountInfo" or "stats"');
      }

      if (type === 'stats' && !platform_families) {
        throw new Error('platform_families parameter is required for stats type');
      }

      validateBoardId(board_id);

      /** @type {{ type: 'accountInfo' | 'stats', nameOnPlatform: string, platformType: PlatformType, platform_families?: PlatformFamily, board_id?: BoardId }} */
      const params = {
        type,
        nameOnPlatform,
        platformType,
      };

      if (type === 'stats') {
        params.platform_families = platform_families;
        if (board_id) {
          params.board_id = board_id;
        }
      }

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      if (type === 'stats') {
        filterBoardProfiles(response.data, board_id);
      }
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error(`Error during the getStats (${type}) request:`, err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      throw err;
    }
  }

  /**
   * Get Rainbow Six Siege operator stats.
   * @param {OperatorStatsParams} params
   * @returns {Promise<any>}
   */
  async getOperatorStats({ nameOnPlatform, platformType, seasonYear, modes }) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      /** @type {{ type: 'operatorStats', nameOnPlatform: string, platformType: PlatformType, modes?: 'ranked' | 'casual' | 'unranked', seasonYear?: string }} */
      const params = {
        type: 'operatorStats',
        nameOnPlatform,
        platformType,
        modes,
      };

      if (seasonYear) {
        params.seasonYear = seasonYear;
      }

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getOperatorStats request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      throw err;
    }
  }

  /**
   * Get Rainbow Six Siege player stats for current season.
   * @param {SeasonalStatsParams} params
   * @returns {Promise<any>}
   */
  async getSeasonalStats({ nameOnPlatform, platformType }) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      /** @type {{ type: 'seasonalStats', nameOnPlatform: string, platformType: PlatformType }} */
      const params = {
        type: 'seasonalStats',
        nameOnPlatform,
        platformType,
      };

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      const err = asHttpError(error);
      console.error('Error during the getSeasonalStats request:', err.message);
      if (err.response?.status === 401) {
        throw new Error('Authentication error');
      }
      throw err;
    }
  }
}

module.exports = Players;
