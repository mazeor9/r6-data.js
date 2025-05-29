const getStats = require('./getStats');

/**
 * Compare statistics between two Rainbow Six Siege players
 * @param {Object} params - Parameters for the comparison
 * @param {string} params.email - Ubisoft account email (used for both players if player2 credentials not provided)
 * @param {string} params.password - Ubisoft account password (used for both players if player2 credentials not provided)
 * @param {Object} params.player1 - First player's info
 * @param {string} params.player1.nameOnPlatform - First player's name on platform
 * @param {string} params.player1.platformType - First player's platform type (uplay, psn, xbl)
 * @param {string} [params.player1.email] - Optional: specific email for player1 (overrides main email)
 * @param {string} [params.player1.password] - Optional: specific password for player1 (overrides main password)
 * @param {Object} params.player2 - Second player's info
 * @param {string} params.player2.nameOnPlatform - Second player's name on platform
 * @param {string} params.player2.platformType - Second player's platform type (uplay, psn, xbl)
 * @param {string} [params.player2.email] - Optional: specific email for player2 (overrides main email)
 * @param {string} [params.player2.password] - Optional: specific password for player2 (overrides main password)
 * @param {string} [params.platform_families='pc'] - Platform families: "pc" or "console"
 * @param {string} [params.board_id='ranked'] - Game mode to compare (casual, event, warmup, standard, ranked)
 * @returns {Promise<Object>} - Comparison results between the two players
 */
async function getPlayerComparison({ 
  email,
  password,
  player1, 
  player2, 
  platform_families = 'pc', 
  board_id = 'ranked' 
} = {}) {
  try {
    // Validate required parameters
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    if (!player1 || !player2) {
      throw new Error('Both player1 and player2 objects are required');
    }

    if (!player1.nameOnPlatform || !player1.platformType) {
      throw new Error('player1 must have nameOnPlatform and platformType');
    }

    if (!player2.nameOnPlatform || !player2.platformType) {
      throw new Error('player2 must have nameOnPlatform and platformType');
    }

    // Validate board_id
    if (!['casual', 'event', 'warmup', 'standard', 'ranked'].includes(board_id)) {
      throw new Error('Invalid board_id. Must be one of: casual, event, warmup, standard, ranked');
    }

    console.log(`Fetching stats for comparison - Board: ${board_id}, Platform: ${platform_families}`);
    console.log(`Player 1: ${player1.nameOnPlatform} (${player1.platformType})`);
    console.log(`Player 2: ${player2.nameOnPlatform} (${player2.platformType})`);

    // Use individual credentials if provided, otherwise use main credentials
    const player1Email = player1.email || email;
    const player1Password = player1.password || password;
    const player2Email = player2.email || email;
    const player2Password = player2.password || password;

    // Fetch stats for both players
    const [stats1, stats2] = await Promise.all([
      getStats({
        type: 'stats',
        email: player1Email,
        password: player1Password,
        nameOnPlatform: player1.nameOnPlatform,
        platformType: player1.platformType,
        platform_families,
        board_id
      }),
      getStats({
        type: 'stats',
        email: player2Email,
        password: player2Password,
        nameOnPlatform: player2.nameOnPlatform,
        platformType: player2.platformType,
        platform_families,
        board_id
      })
    ]);

    // Extract player data for the specified board_id
    const player1Data = extractPlayerStats(stats1, board_id);
    const player2Data = extractPlayerStats(stats2, board_id);

    if (!player1Data || !player2Data) {
      throw new Error(`Unable to extract stats for board_id: ${board_id}. Make sure both players have data for this game mode.`);
    }

    // Compare the stats
    const comparison = comparePlayerStats(player1Data, player2Data);

    return {
      player1: {
        name: player1.nameOnPlatform,
        platform: player1.platformType,
        stats: player1Data
      },
      player2: {
        name: player2.nameOnPlatform,
        platform: player2.platformType,
        stats: player2Data
      },
      comparison,
      metadata: {
        platform_families,
        board_id,
        comparedAt: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('Error during the getPlayerComparison request:', error.message);
    if (error.message.includes('Authentication error')) {
      throw new Error('Authentication error - Check credentials');
    }
    throw error;
  }
}

/**
 * Extract player statistics for a specific board_id from the API response
 * @param {Object} statsResponse - Response from getStats
 * @param {string} boardId - The board_id to extract stats for
 * @returns {Object|null} - Extracted player stats or null if not found
 */
function extractPlayerStats(statsResponse, boardId) {
  try {
    if (!statsResponse || !statsResponse.platform_families_full_profiles) {
      console.error('Invalid stats response structure');
      return null;
    }

    const platformProfile = statsResponse.platform_families_full_profiles[0];
    if (!platformProfile || !platformProfile.board_ids_full_profiles) {
      console.error('No platform profile found');
      return null;
    }

    // Find the specific board_id
    const boardProfile = platformProfile.board_ids_full_profiles.find(
      board => board.board_id === boardId
    );

    if (!boardProfile || !boardProfile.full_profiles || boardProfile.full_profiles.length === 0) {
      console.error(`No data found for board_id: ${boardId}`);
      return null;
    }

    const fullProfile = boardProfile.full_profiles[0];
    const profile = fullProfile.profile || {};
    const seasonStats = fullProfile.season_statistics || {};
    const matchOutcomes = seasonStats.match_outcomes || {};

    return {
      // Profile data
      rank: profile.rank || 0,
      max_rank: profile.max_rank || 0,
      rank_points: profile.rank_points || 0,
      max_rank_points: profile.max_rank_points || 0,
      
      // Season statistics
      kills: seasonStats.kills || 0,
      deaths: seasonStats.deaths || 0,
      
      // Match outcomes
      wins: matchOutcomes.wins || 0,
      losses: matchOutcomes.losses || 0,
      abandons: matchOutcomes.abandons || 0,
      
      // Calculated metrics
      kd_ratio: seasonStats.deaths > 0 ? 
        parseFloat((seasonStats.kills / seasonStats.deaths).toFixed(2)) : 
        seasonStats.kills,
      
      win_rate: (matchOutcomes.wins + matchOutcomes.losses) > 0 ? 
        parseFloat(((matchOutcomes.wins / (matchOutcomes.wins + matchOutcomes.losses)) * 100).toFixed(2)) : 0,
      
      total_matches: (matchOutcomes.wins || 0) + (matchOutcomes.losses || 0) + (matchOutcomes.abandons || 0)
    };

  } catch (error) {
    console.error('Error extracting player stats:', error.message);
    return null;
  }
}

/**
 * Compare two players' statistics and return detailed comparison
 * @param {Object} player1Stats - First player's extracted stats
 * @param {Object} player2Stats - Second player's extracted stats
 * @returns {Object} - Detailed comparison results
 */
function comparePlayerStats(player1Stats, player2Stats) {
  try {
    const comparison = {
      winner: null,
      metrics: {},
      summary: {},
      advantages: {
        player1: [],
        player2: []
      }
    };

    // Define metrics to compare
    const directMetrics = [
      { key: 'kills', label: 'Kills', higher_better: true },
      { key: 'deaths', label: 'Deaths', higher_better: false },
      { key: 'wins', label: 'Wins', higher_better: true },
      { key: 'losses', label: 'Losses', higher_better: false },
      { key: 'abandons', label: 'Abandons', higher_better: false },
      { key: 'rank', label: 'Current Rank', higher_better: true },
      { key: 'max_rank', label: 'Max Rank', higher_better: true },
      { key: 'rank_points', label: 'Rank Points', higher_better: true },
      { key: 'total_matches', label: 'Total Matches', higher_better: true }
    ];

    const calculatedMetrics = [
      { key: 'kd_ratio', label: 'K/D Ratio', higher_better: true },
      { key: 'win_rate', label: 'Win Rate (%)', higher_better: true }
    ];

    let player1Score = 0;
    let player2Score = 0;

    // Compare direct metrics
    directMetrics.forEach(metric => {
      const val1 = player1Stats[metric.key] || 0;
      const val2 = player2Stats[metric.key] || 0;
      
      let winner = null;
      if (val1 > val2) {
        winner = metric.higher_better ? 'player1' : 'player2';
      } else if (val2 > val1) {
        winner = metric.higher_better ? 'player2' : 'player1';
      }

      comparison.metrics[metric.key] = {
        label: metric.label,
        player1: val1,
        player2: val2,
        difference: val1 - val2,
        percentage_diff: val2 !== 0 ? parseFloat(((val1 - val2) / val2 * 100).toFixed(2)) : null,
        winner: winner
      };

      // Award points and track advantages
      if (winner === 'player1') {
        player1Score++;
        comparison.advantages.player1.push(metric.label);
      } else if (winner === 'player2') {
        player2Score++;
        comparison.advantages.player2.push(metric.label);
      }
    });

    // Compare calculated metrics
    calculatedMetrics.forEach(metric => {
      const val1 = player1Stats[metric.key] || 0;
      const val2 = player2Stats[metric.key] || 0;
      
      let winner = null;
      if (val1 > val2) {
        winner = 'player1';
      } else if (val2 > val1) {
        winner = 'player2';
      }

      comparison.metrics[metric.key] = {
        label: metric.label,
        player1: val1,
        player2: val2,
        difference: parseFloat((val1 - val2).toFixed(2)),
        winner: winner
      };

      // Award points and track advantages
      if (winner === 'player1') {
        player1Score++;
        comparison.advantages.player1.push(metric.label);
      } else if (winner === 'player2') {
        player2Score++;
        comparison.advantages.player2.push(metric.label);
      }
    });

    // Determine overall winner
    comparison.winner = player1Score > player2Score ? 'player1' : 
                      player2Score > player1Score ? 'player2' : 'tie';

    comparison.summary = {
      player1_score: player1Score,
      player2_score: player2Score,
      total_metrics_compared: directMetrics.length + calculatedMetrics.length,
      score_difference: Math.abs(player1Score - player2Score),
      competitiveness: Math.abs(player1Score - player2Score) <= 2 ? 'Very Close' : 
                      Math.abs(player1Score - player2Score) <= 4 ? 'Close' : 'Decisive'
    };

    return comparison;

  } catch (error) {
    console.error('Error comparing player stats:', error.message);
    return { error: 'Failed to compare player statistics' };
  }
}

module.exports = getPlayerComparison;