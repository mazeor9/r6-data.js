const buildUrlAndParams = require('../utils/buildUrl');

class Players {
  /**
   * @param {R6Client} client - The main client instance
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get Rainbow Six Siege player account information
   * @param {Object} params - Parameters for the request
   * @param {string} params.nameOnPlatform - Player name on the platform
   * @param {string} params.platformType - Platform type (uplay, psn, xbl)
   * @returns {Promise<Object>} - Player account information
   */
  async getAccountInfo({ nameOnPlatform, platformType } = {}) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      const params = {
        type: 'accountInfo',
        nameOnPlatform,
        platformType
      };

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error during the getAccountInfo request:', error.message);
      if (error.response && error.response.status === 401) {
        throw new Error('Authentication error');
      }
      throw error;
    }
  }

  /**
   * Get Rainbow Six Siege player ban status
   * @param {Object} params - Parameters for the request
   * @param {string} params.nameOnPlatform - Player name on the platform
   * @param {string} params.platformType - Platform type (uplay, psn, xbl)
   * @returns {Promise<Object>} - Player ban status
   */
  async getIsBanned({ nameOnPlatform, platformType } = {}) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      const params = {
        type: 'isBanned',
        nameOnPlatform,
        platformType
      };

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      
      return response.data;
    } catch (error) {
      console.error('Error during the getIsBanned request:', error.message);
      if (error.response && error.response.status === 401) {
        throw new Error('Authentication error');
      }
      throw error;
    }
  }

  /**
   * Get Rainbow Six Siege player statistics
   * @param {Object} params - Parameters for the request
   * @param {string} params.nameOnPlatform - Player name on the platform
   * @param {string} params.platformType - Platform type (uplay, psn, xbl)
   * @param {string} params.platform_families - Platform families: "pc" or "console"
   * @param {string} [params.board_id] - Game mode to filter stats
   * @returns {Promise<Object>} - Player statistics
   */
  async getPlayerStats({ nameOnPlatform, platformType, platform_families, board_id } = {}) {
    try {
      if (!nameOnPlatform || !platformType || !platform_families) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType, platform_families');
      }

      if (board_id && !['casual', 'event', 'warmup', 'standard', 'ranked'].includes(board_id)) {
        throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
      }

      const params = {
        type: 'stats',
        nameOnPlatform,
        platformType,
        platform_families
      };

      if (board_id) {
        params.board_id = board_id;
      }

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      
      if (response.data && 
          response.data.platform_families_full_profiles && 
          response.data.platform_families_full_profiles.length > 0) {
        if (board_id && response.data.platform_families_full_profiles) {
          response.data.platform_families_full_profiles.forEach(profile => {
            if (profile.board_ids_full_profiles) {
              profile.board_ids_full_profiles = profile.board_ids_full_profiles.filter(
                board => board.board_id === board_id
              );
            }
          });
        }
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

  /**
   * Compare Rainbow Six Siege player statistics between multiple players
   * @param {Object} params - Parameters for the request
   * @param {Array<Object>} params.players - Array of player objects to compare
   * @param {string} params.platform_families - Platform families: "pc" or "console"
   * @param {string} [params.board_id] - Game mode to filter stats
   * @returns {Promise<Object>} - Comparison results
   */
  async getPlayerComparisons({ players, platform_families, board_id } = {}) {
    try {
      if (!players || !Array.isArray(players) || players.length < 2) {
        throw new Error('At least 2 players are required for comparison');
      }

      if (!platform_families) {
        throw new Error('Missing required parameter: platform_families');
      }

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player.nameOnPlatform || !player.platformType) {
          throw new Error(`Player ${i + 1} is missing required fields: nameOnPlatform, platformType`);
        }
      }

      if (board_id && !['casual', 'event', 'warmup', 'standard', 'ranked'].includes(board_id)) {
        throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
      }

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
          const response = await this.client.httpClient.get(url);

          if (response.data && 
              response.data.platform_families_full_profiles && 
              response.data.platform_families_full_profiles.length > 0) {
            
            if (board_id && response.data.platform_families_full_profiles) {
              response.data.platform_families_full_profiles.forEach(profile => {
                if (profile.board_ids_full_profiles) {
                  profile.board_ids_full_profiles = profile.board_ids_full_profiles.filter(
                    board => board.board_id === board_id
                  );
                }
              });
            }

            playerStats.push({ player, stats: response.data, success: true });
          } else {
            playerStats.push({ player, stats: null, success: false, error: 'No stats found for player' });
          }
        } catch (error) {
          errors.push({ player, error: error.message });
          playerStats.push({ player, stats: null, success: false, error: error.message });
        }
      }
      
      return {
        comparisons: playerStats,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      console.error('Error during the getPlayerComparisons request:', error.message);
      throw error;
    }
  }

  /**
   * Get Rainbow Six Siege player stats or account information
   * @param {Object} params - Parameters for the request
   * @param {string} params.type - Type of request: "accountInfo" or "stats"
   * @param {string} params.nameOnPlatform - Player name on the platform
   * @param {string} params.platformType - Platform type (uplay, psn, xbl)
   * @param {string} [params.platform_families] - Platform families (required for stats type)
   * @param {string} [params.board_id] - Game mode to filter stats
   * @returns {Promise<Object>} - Player stats or account information
   */
  async getStats({ type, nameOnPlatform, platformType, platform_families, board_id } = {}) {
    try {
      if (!type || !nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: type, nameOnPlatform, platformType');
      }

      if (type !== 'accountInfo' && type !== 'stats') {
        throw new Error('Invalid type parameter. Must be "accountInfo" or "stats"');
      }

      if (type === 'stats' && !platform_families) {
        throw new Error('platform_families parameter is required for stats type');
      }

      if (board_id && !['casual', 'event', 'warmup', 'standard', 'ranked'].includes(board_id)) {
        throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
      }

      const params = {
        type,
        nameOnPlatform,
        platformType
      };

      if (type === 'stats') {
        params.platform_families = platform_families;
        if (board_id) {
          params.board_id = board_id;
        }
      }

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      
      if (response.data && 
          response.data.platform_families_full_profiles && 
          response.data.platform_families_full_profiles.length > 0) {
        
        if (type === 'stats' && board_id && response.data.platform_families_full_profiles) {
          response.data.platform_families_full_profiles.forEach(profile => {
            if (profile.board_ids_full_profiles) {
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

  /**
   * Get Rainbow Six Siege operator stats
   * @param {Object} params - Parameters for the request
   * @param {string} params.nameOnPlatform - Player name on the platform
   * @param {string} params.platformType - Platform type (uplay, psn, xbl)
   * @param {string} [params.seasonYear] - Season year (e.g., Y9S4, Y10S4)
   * @param {string} [params.modes] - Game mode (ranked, casual, unranked). Default is 'ranked'.
   * @returns {Promise<Object>} - Operator stats
   */
  async getOperatorStats({ nameOnPlatform, platformType, seasonYear, modes } = {}) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      const params = {
        type: 'operatorStats',
        nameOnPlatform,
        platformType,
        modes
      };

      if (seasonYear) {
        params.seasonYear = seasonYear;
      }

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getOperatorStats request:', error.message);
      if (error.response && error.response.status === 401) {
        throw new Error('Authentication error');
      }
      throw error;
    }
  }

  /**
   * Get Rainbow Six Siege player stats for current season
   * @param {Object} params - Parameters for the request
   * @param {string} params.nameOnPlatform - Player name on the platform
   * @param {string} params.platformType - Platform type (uplay, psn, xbl)
   * @returns {Promise<Object>} - Player stats for current season
   */
  async getSeasonalStats({ nameOnPlatform, platformType } = {}) {
    try {
      if (!nameOnPlatform || !platformType) {
        throw new Error('Missing required parameters: nameOnPlatform, platformType');
      }

      const params = {
        type: 'seasonalStats',
        nameOnPlatform,
        platformType
      };

      const url = buildUrlAndParams('/stats', params);
      const response = await this.client.httpClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error during the getSeasonalStats request:', error.message);
      if (error.response && error.response.status === 401) {
        throw new Error('Authentication error');
      }
      throw error;
    }
  }
}

module.exports = Players;
