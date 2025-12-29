const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege game stats for all platform
 * @param {string} apiKey - Your API Key from r6data.eu
 * @returns {Promise<Object>} - Game stats for all platform
 */
async function getGameStats(apiKey) {
  try {
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }

      // Build the URL with parameters
    const params = {
      type: 'gameStats'
    };

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error during the game stats request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getGameStats;
