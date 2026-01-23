const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege operator stats
 * @param {string} apiKey - Your API Key from r6data.eu
 * @param {Object} params - Parameters for the request
 * @param {string} params.nameOnPlatform - Player name on the platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * @param {string} [params.seasonYear] - Season year (e.g., Y9S4, Y10S4)
 * @param {string} [params.modes] - Game mode (ranked, casual, unranked). Default is 'ranked'.
 * @returns {Promise<Object>} - Operator stats
 */
async function getOperatorStats(apiKey, { nameOnPlatform, platformType, seasonYear, modes } = {}) {
  try {
    // Validate required parameters
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }
    if (!nameOnPlatform || !platformType) {
      throw new Error('Missing required parameters: nameOnPlatform, platformType');
    }

    // Build the URL with parameters
    const params = {
      type: 'operatorStats',
      nameOnPlatform,
      platformType,
      modes
    };

    if (seasonYear) {
      params.seasonYear = seasonYear;
    }

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error during the getOperatorStats request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

module.exports = getOperatorStats;
