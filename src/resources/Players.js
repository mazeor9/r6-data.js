const buildUrlAndParams = require('../utils/buildUrl');

/** @typedef {import('../R6Client')} R6Client */
/** @typedef {import('../../types/params-interfaces').ProfileParams} ProfileParams */
/** @typedef {import('../../types/params-interfaces').OperatorStatsParams} OperatorStatsParams */
/** @typedef {import('../../types/params-interfaces').LeaderboardParams} LeaderboardParams */
/** @typedef {import('../../types/result-interfaces').PlayerProfileResponse} PlayerProfileResponse */
/** @typedef {import('../../types/result-interfaces').OperatorStatsResponse} OperatorStatsResponse */
/** @typedef {import('../../types/result-interfaces').LeaderboardResponse} LeaderboardResponse */

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

/**
 * @param {string} method
 * @param {unknown} error
 * @returns {never}
 */
function rethrowRequestError(method, error) {
  const err = asHttpError(error);
  console.error(`Error during the ${method} request:`, err.message);
  if (err.response?.status === 401) {
    throw new Error('Authentication error');
  }
  throw err;
}

const VALID_PLATFORM_FAMILIES = new Set(['pc', 'psn', 'xbl']);
const VALID_OPERATOR_MODES = new Set([
  'all', 'ranked', 'standard', 'unranked', 'quick-match', 'casual', 'dual-front', 'siege-cup',
]);

class Players {
  /**
   * @param {R6Client} client - The main client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get the complete V2 player profile in one request.
   * The response contains account, stats, ban status, seasons and rank history.
   * @param {ProfileParams} params
   * @returns {Promise<PlayerProfileResponse>}
   */
  async getProfile({ nameOnPlatform, platformType, platform_families }) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }
      if (platform_families && !VALID_PLATFORM_FAMILIES.has(platform_families)) {
        throw new Error('Invalid platform_families. Must be one of: pc, psn, xbl');
      }

      const url = buildUrlAndParams('/v2/profile', {
        nameOnPlatform,
        platformType,
        platform_families,
      });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      return rethrowRequestError('getProfile', error);
    }
  }

  /**
   * Get V2 player operator statistics with optional season and mode filters.
   * @param {OperatorStatsParams} params
   * @returns {Promise<OperatorStatsResponse>}
   */
  async getOperatorStats({ nameOnPlatform, platformType, seasonYear, modes }) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }
      if (modes && !VALID_OPERATOR_MODES.has(modes)) {
        throw new Error(`Invalid modes. Must be one of: ${[...VALID_OPERATOR_MODES].join(', ')}`);
      }

      const url = buildUrlAndParams('/v2/operators', {
        nameOnPlatform,
        platformType,
        seasonYear,
        modes,
      });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      return rethrowRequestError('getOperatorStats', error);
    }
  }

  /**
   * Get the V2 ranked leaderboard.
   * @param {LeaderboardParams} [params={}]
   * @returns {Promise<LeaderboardResponse>}
   */
  async getLeaderboard({ page, platform } = {}) {
    try {
      if (page !== undefined && (!Number.isInteger(page) || page < 1 || page > 50)) {
        throw new Error('Invalid page. Must be an integer between 1 and 50');
      }
      if (platform && !VALID_PLATFORM_FAMILIES.has(platform)) {
        throw new Error('Invalid platform. Must be one of: pc, psn, xbl');
      }

      const url = buildUrlAndParams('/v2/leaderboard', { page, platform });
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      return rethrowRequestError('getLeaderboard', error);
    }
  }
}

module.exports = Players;
