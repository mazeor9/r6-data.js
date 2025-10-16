const axiosInstance = require('../axiosInstance/axiosInstance');

/**
 * Get Rainbow Six Siege game stats for all platform
 * @returns {Promise<Object>} - Game stats for all platform
 */
async function getGameStats() {
  try {

      // Build the URL with parameters
    const params = {
      type: 'gameStats'
    };

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url);

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
