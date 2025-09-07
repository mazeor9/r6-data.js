const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege player account information
 * @param {Object} params - Parameters for the request
 * @param {string} params.nameOnPlatform - Player name on the platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * @returns {Promise<Object>} - Player account information
 */
async function getAccountInfo({ nameOnPlatform, platformType } = {}) {
  try {
    // Validate required parameters
    if (!nameOnPlatform || !platformType) {
      throw new Error('Missing required parameters: nameOnPlatform, platformType');
    }

    // Build the URL with parameters
    const params = {
      type: 'accountInfo',
      nameOnPlatform,
      platformType
    };

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url);
    
    return response.data;
  } catch (error) {
    console.error('Error during the getAccountInfo request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

module.exports = getAccountInfo;