const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege player ban status
 * @param {string} apiKey - Your API Key from r6data.eu
 * @param {Object} params - Parameters for the request
 * @param {string} params.nameOnPlatform - Player name on the platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * @returns {Promise<Object>} - Player ban status
 */
async function getIsBanned(apiKey, { nameOnPlatform, platformType } = {}) {
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
      type: 'isBanned',
      nameOnPlatform,
      platformType
    };

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error during the getIsBanned request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

module.exports = getIsBanned;
