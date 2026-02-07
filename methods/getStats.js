const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege player stats or account information
 * @param {string} apiKey - Your API Key from r6data.eu
 * @param {Object} params - Parameters for the request
 * @param {string} params.type - Type of request: "accountInfo" or "stats"
 * @param {string} params.nameOnPlatform - Player name on the platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * @param {string} [params.platform_families] - Platform families (required for stats type): "pc" or "console"
 * @param {string} [params.board_id] - Game mode to filter stats (casual, event, warmup, standard, ranked)
 * @returns {Promise<Object>} - Player stats or account information
 */
async function getStats(apiKey, { type, nameOnPlatform, platformType, platform_families, board_id } = {}) {
  try {
    // Validate required parameters
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }
    if (!type || !nameOnPlatform || !platformType) {
      throw new Error('Missing required parameters: type, nameOnPlatform, platformType');
    }

    // Validate type parameter
    if (type !== 'accountInfo' && type !== 'stats') {
      throw new Error('Invalid type parameter. Must be "accountInfo" or "stats"');
    }

    // If type is stats, platform_families is required
    if (type === 'stats' && !platform_families) {
      throw new Error('platform_families parameter is required for stats type');
    }

    // Validate board_id if provided
    if (board_id && !['casual', 'event', 'warmup', 'standard', 'ranked'].includes(board_id)) {
      throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
    }

    // Build the URL with parameters
    const params = {
      type,
      nameOnPlatform,
      platformType
    };

    // Add platform_families for stats type
    if (type === 'stats') {
      params.platform_families = platform_families;
      
      // Add board_id if provided
      if (board_id) {
        params.board_id = board_id;
      }
    }

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });
    
    if (response.data && 
        response.data.platform_families_full_profiles && 
        response.data.platform_families_full_profiles.length > 0) {
      
      // If board_id is specified, filter the response data
      if (type === 'stats' && board_id && response.data.platform_families_full_profiles) {
        response.data.platform_families_full_profiles.forEach(profile => {
          if (profile.board_ids_full_profiles) {
            // Filter to only include the specified board_id
            profile.board_ids_full_profiles = profile.board_ids_full_profiles.filter(
              board => board.board_id === board_id
            );
          }
        });
      }
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
