const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Compare Rainbow Six Siege player statistics between multiple players
 * @param {Object} params - Parameters for the request
 * @param {Array<Object>} params.players - Array of player objects to compare
 * @param {string} params.players[].nameOnPlatform - Player name on the platform
 * @param {string} params.players[].platformType - Platform type (uplay, psn, xbl)
 * @param {string} params.platform_families - Platform families: "pc" or "console"
 * @param {string} [params.board_id] - Game mode to filter stats (casual, event, warmup, standard, ranked)
 * @param {Array<string>} [params.compareFields] - Specific fields to compare (e.g., ['kills', 'deaths', 'wins', 'losses'])
 * @returns {Promise<Object>} - Comparison results with player statistics and comparison metrics
 */
async function getPlayerComparisons({ players, platform_families, board_id, compareFields } = {}) {
  try {
    // Validate required parameters
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
        const response = await axiosInstance.get(url);

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

    // Generate comparison results
    const comparison = {
      players: playerStats,
      comparison_summary: generateComparisonSummary(playerStats, compareFields),
      metadata: {
        total_players: players.length,
        successful_fetches: playerStats.filter(p => p.success).length,
        failed_fetches: playerStats.filter(p => !p.success).length,
        platform_families,
        board_id: board_id || 'all',
        timestamp: new Date().toISOString()
      }
    };

    if (errors.length > 0) {
      comparison.errors = errors;
    }

    return comparison;

  } catch (error) {
    console.error('Error during the getPlayerComparisons request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

/**
 * Generate comparison summary between players
 * @param {Array} playerStats - Array of player statistics
 * @param {Array} compareFields - Fields to compare
 * @returns {Object} - Comparison summary
 */
function generateComparisonSummary(playerStats, compareFields) {
  const successfulStats = playerStats.filter(p => p.success && p.stats);
  
  if (successfulStats.length < 2) {
    return {
      message: 'Not enough valid player data for comparison',
      valid_players: successfulStats.length
    };
  }

  const summary = {
    field_comparisons: {},
    rankings: {}
  };

  // Default fields to compare if none specified
  const fieldsToCompare = compareFields || [
    'kills', 'deaths', 'wins', 'losses', 'matches_played', 
    'time_played', 'headshots', 'melee_kills', 'revives'
  ];

  // Extract and compare stats
  fieldsToCompare.forEach(field => {
    const fieldData = [];
    
    successfulStats.forEach(playerStat => {
      const stats = extractFieldFromStats(playerStat.stats, field);
      if (stats !== null) {
        fieldData.push({
          player: playerStat.player.nameOnPlatform,
          value: stats,
          platform: playerStat.player.platformType
        });
      }
    });

    if (fieldData.length > 0) {
      // Sort by value (descending)
      fieldData.sort((a, b) => b.value - a.value);
      
      summary.field_comparisons[field] = {
        rankings: fieldData,
        highest: fieldData[0],
        lowest: fieldData[fieldData.length - 1],
        average: fieldData.reduce((sum, item) => sum + item.value, 0) / fieldData.length
      };
    }
  });

  return summary;
}

/**
 * Extract a specific field value from player stats
 * @param {Object} stats - Player statistics object
 * @param {string} field - Field name to extract
 * @returns {number|null} - Field value or null if not found
 */
function extractFieldFromStats(stats, field) {
  try {
    if (!stats.platform_families_full_profiles || stats.platform_families_full_profiles.length === 0) {
      return null;
    }

    const profile = stats.platform_families_full_profiles[0];
    if (!profile.board_ids_full_profiles || profile.board_ids_full_profiles.length === 0) {
      return null;
    }

    const boardProfile = profile.board_ids_full_profiles[0];
    if (!boardProfile.full_profiles || boardProfile.full_profiles.length === 0) {
      return null;
    }

    const fullProfile = boardProfile.full_profiles[0];
    
    // Map common field names to actual API field names
    const fieldMapping = {
      'kills': 'kills',
      'deaths': 'deaths', 
      'wins': 'wins',
      'losses': 'losses',
      'matches_played': 'matches_played',
      'time_played': 'time_played',
      'headshots': 'headshots',
      'melee_kills': 'melee_kills',
      'revives': 'revives'
    };

    const actualField = fieldMapping[field] || field;
    return fullProfile[actualField] || 0;

  } catch (error) {
    console.warn(`Error extracting field ${field}:`, error.message);
    return null;
  }
}

module.exports = getPlayerComparisons;