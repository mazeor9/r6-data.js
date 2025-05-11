const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege player stats or account information
 * @param {Object} params - Parameters for the request
 * @param {string} params.type - Type of request: "accountInfo" or "stats"
 * @param {string} params.email - Ubisoft account email
 * @param {string} params.password - Ubisoft account password
 * @param {string} params.nameOnPlatform - Player name on the platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * @param {string} [params.platform_families] - Platform families (required for stats type): "pc" or "console"
 * @returns {Promise<Object>} - Player stats or account information
 */
async function getStats({ type, email, password, nameOnPlatform, platformType, platform_families } = {}) {
  try {
    // Validate required parameters
    if (!type || !email || !password || !nameOnPlatform || !platformType) {
      throw new Error('Missing required parameters: type, email, password, nameOnPlatform, platformType');
    }

    // Validate type parameter
    if (type !== 'accountInfo' && type !== 'stats') {
      throw new Error('Invalid type parameter. Must be "accountInfo" or "stats"');
    }

    // If type is stats, platform_families is required
    if (type === 'stats' && !platform_families) {
      throw new Error('platform_families parameter is required for stats type');
    }

    // Build the URL with parameters
    const params = {
      type,
      email,
      password,
      nameOnPlatform,
      platformType
    };

    // Add platform_families for stats type
    if (type === 'stats') {
      params.platform_families = platform_families;
    }

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url);
    
    if (response.data && 
        response.data.platform_families_full_profiles && 
        response.data.platform_families_full_profiles.length > 0) {
      
      response.data.platform_families_full_profiles.forEach(profile => {
        if (profile.board_ids_full_profiles) {
          console.log('Board IDs Full Profiles:', JSON.stringify(profile.board_ids_full_profiles, null, 2));
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error during the getStats (${type}) request:`, error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

module.exports = getStats;