const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Get Rainbow Six Siege player statistics
 * @param {Object} params - Parameters for the request
 * @param {string} params.nameOnPlatform - Player name on the platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * @param {string} params.platform_families - Platform families: "pc" or "console"
 * @param {string} [params.board_id] - Game mode to filter stats (casual, event, warmup, standard, ranked)
 * @returns {Promise<Object>} - Player statistics
 */
async function getPlayerStats({ nameOnPlatform, platformType, platform_families, board_id } = {}) {
  try {
    // Validate required parameters
    if (!nameOnPlatform || !platformType || !platform_families) {
      throw new Error('Missing required parameters: nameOnPlatform, platformType, platform_families');
    }

    // Validate board_id if provided
    if (board_id && !['casual', 'event', 'warmup', 'standard', 'ranked'].includes(board_id)) {
      throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
    }

    // Build the URL with parameters
    const params = {
      type: 'stats',
      nameOnPlatform,
      platformType,
      platform_families
    };

    // Add board_id if provided
    if (board_id) {
      params.board_id = board_id;
    }

    const url = buildUrlAndParams('/stats', params);

    const response = await axiosInstance.get(url);
    
    if (response.data && 
        response.data.platform_families_full_profiles && 
        response.data.platform_families_full_profiles.length > 0) {
      
      // If board_id is specified, filter the response data
      if (board_id && response.data.platform_families_full_profiles) {
        response.data.platform_families_full_profiles.forEach(profile => {
          if (profile.board_ids_full_profiles) {
            // Filter to only include the specified board_id
            profile.board_ids_full_profiles = profile.board_ids_full_profiles.filter(
              board => board.board_id === board_id
            );
          }
        });
      }
      
      response.data.platform_families_full_profiles.forEach(profile => {
        if (profile.board_ids_full_profiles) {
          console.log(JSON.stringify(profile.board_ids_full_profiles, null, 2));
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during the getPlayerStats request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

module.exports = getPlayerStats;