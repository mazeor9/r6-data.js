const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege player stats for current season
 * @param {Object} params - Parameters for the request
 * @param {string} params.nameOnPlatform - Player name on the platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * @returns {Promise<Object>} - Player stats for current season
 */
async function getSeasonalStats({ nameOnPlatform, platformType } = {}) {
  try {
    // Validate required parameters
    if (!nameOnPlatform || !platformType) {
      throw new Error('Missing required parameters: nameOnPlatform, platformType');
    }

    // Build the URL with parameters
    const params = {
      type: 'seasonalStats',
      nameOnPlatform,
      platformType
    };

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Error during the getSeasonalStats request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

module.exports = getSeasonalStats;