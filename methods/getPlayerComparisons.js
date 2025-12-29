const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Compare Rainbow Six Siege player statistics between multiple players
 * @param {string} apiKey - Your API Key from r6data.eu
 * @param {Object} params - Parameters for the request
 * @param {Array<Object>} params.players - Array of player objects to compare
 * @param {string} params.players[].nameOnPlatform - Player name on the platform
 * @param {string} params.players[].platformType - Platform type (uplay, psn, xbl)
 * @param {string} params.platform_families - Platform families: "pc" or "console"
 * @param {string} [params.board_id] - Game mode to filter stats (casual, event, warmup, standard, ranked)
 * @param {Array<string>} [params.compareFields] - Specific fields to compare (e.g., ['kills', 'deaths', 'wins', 'losses'])
 * @returns {Promise<Object>} - Comparison results with player statistics and comparison metrics
 */
async function getPlayerComparisons(apiKey, { players, platform_families, board_id, compareFields } = {}) {
  try {
    // Validate required parameters
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }
    if (!players || !Array.isArray(players) || players.length < 2) {
      throw new Error('At least 2 players are required for comparison');
    }

    if (!platform_families) {
      throw new Error('Missing required parameter: platform_families');
    }

    // Validate each player object
    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (!player.nameOnPlatform || !player.platformType) {
        throw new Error(`Player ${i + 1} is missing required fields: nameOnPlatform, platformType`);
      }
    }

    // Validate board_id if provided
    if (board_id && !['casual', 'event', 'warmup', 'standard', 'ranked'].includes(board_id)) {
      throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
    }

    // Fetch stats for each player
    const playerStats = [];
    const errors = [];

    for (const player of players) {
      try {
        const params = {
          type: 'stats',
          nameOnPlatform: player.nameOnPlatform,
          platformType: player.platformType,
          platform_families
        };

        if (board_id) {
          params.board_id = board_id;
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
          
          // Filter by board_id if specified
          if (board_id && response.data.platform_families_full_profiles) {
            response.data.platform_families_full_profiles.forEach(profile => {
              if (profile.board_ids_full_profiles) {
                profile.board_ids_full_profiles = profile.board_ids_full_profiles.filter(
                  board => board.board_id === board_id
                );
              }
            });
          }

          playerStats.push({
            player: player,
            stats: response.data,
            success: true
          });
        } else {
          playerStats.push({
            player: player,
            stats: null,
            success: false,
            error: 'No stats found for player'
          });
        }
      } catch (error) {
        errors.push({
          player: player,
          error: error.message
        });
        playerStats.push({
          player: player,
          stats: null,
          success: false,
          error: error.message
        });
      }
    }
    
    // Logic for comparison could be added here if needed, but returning collected stats for now
    return {
      comparisons: playerStats,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error) {
    console.error('Error during the getPlayerComparisons request:', error.message);
    throw error;
  }
}

module.exports = getPlayerComparisons;
