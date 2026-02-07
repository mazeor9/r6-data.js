const axiosInstance = require('../axiosInstance/axiosInstance');

async function createDiscordR6Webhook(webhookUrl, playerData, options = {}) {
  try {
    if (!webhookUrl || !playerData) {
      throw new Error('Missing required parameters: webhookUrl and playerData are required');
    }

    if (!options.playerName) {
      throw new Error('Missing required parameter: options.playerName is required');
    }

    // Validate webhook URL format
    const discordWebhookRegex = /^https:\/\/(?:ptb\.|canary\.)?discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9-_]+$/;
    if (!discordWebhookRegex.test(webhookUrl)) {
      throw new Error('Invalid Discord webhook URL format');
    }

    const embed = createR6StatsEmbed(playerData, options);
    
    const payload = {
      embeds: [embed]
    };

    // Add custom message if provided
    if (options.message) {
      payload.content = options.message;
    }

    const response = await axiosInstance.post(webhookUrl, payload);
    
    return {
      success: true,
      messageId: response.headers['x-discord-message-id'],
      sentAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error during createDiscordR6Webhook request:', error.message);
    if (error.response && error.response.status === 404) {
      throw new Error('Discord webhook not found - check webhook URL');
    }
    if (error.response && error.response.status === 401) {
      throw new Error('Discord webhook unauthorized - webhook may be disabled');
    }
    if (error.response && error.response.status === 429) {
      throw new Error('Discord rate limit exceeded - try again later');
    }
    throw error;
  }
}

function createR6StatsEmbed(playerData, options) {
  let stats, dataSource;
  
  if (playerData.stats) {
    // Steam data format
    stats = playerData.stats;
    dataSource = 'Steam';
  } else if (playerData.platform_families_full_profiles) {
    // Ubisoft API data format - from getStats method
    stats = parseUbisoftStatsFromResponse(playerData);
    dataSource = 'Ubisoft';
  } else if (Array.isArray(playerData)) {
    // Ubisoft API data format - direct array
    stats = parseUbisoftStats(playerData);
    dataSource = 'Ubisoft';
  } else {
    // Fallback
    stats = playerData;
    dataSource = 'Custom';
  }

  const embed = {
    title: `${options.title || 'Rainbow Six Siege Stats'}`,
    description: `Stats for **${options.playerName}**`,
    color: options.color || 0xF99E1A,
    fields: createStatsFields(stats, dataSource),
    thumbnail: {
      url: options.avatarUrl || 'https://ubisoft-avatars.akamaized.net/default_256_256.png'
    },
    footer: {
      text: `Data from ${dataSource} | r6-data.js`
    },
    timestamp: new Date().toISOString()
  };

  return embed;
}

function parseUbisoftStatsFromResponse(response) {
  const platformProfile = response.platform_families_full_profiles[0];
  if (!platformProfile || !platformProfile.board_ids_full_profiles) {
    return { ranked: null, standard: null };
  }
  
  const boardsArray = platformProfile.board_ids_full_profiles;
  return parseUbisoftStats(boardsArray);
}

function parseUbisoftStats(data) {
  let rankedStats = null;
  let standardStats = null;
  
  for (const board of data) {
    if (board.board_id === 'ranked' && board.full_profiles && board.full_profiles[0]) {
      rankedStats = {
        profile: board.full_profiles[0].profile,
        season_statistics: board.full_profiles[0].season_statistics
      };
    }
    
    if (board.board_id === 'standard' && board.full_profiles && board.full_profiles[0]) {
      standardStats = {
        profile: board.full_profiles[0].profile,
        season_statistics: board.full_profiles[0].season_statistics
      };
    }
  }
  
  return {
    ranked: rankedStats,
    standard: standardStats
  };
}

function createStatsFields(stats, dataSource) {
  const fields = [];

  if (dataSource === 'Steam') {
    fields.push(
      {
        name: 'General Stats',
        value: `**Matches Played:** ${stats.generalStats?.matchesPlayed || 'N/A'}\n**Win Rate:** ${stats.generalStats?.winRate || 0}%\n**Playtime:** ${stats.generalStats?.totalTimePlayedHours || 0}h`,
        inline: true
      },
      {
        name: 'Combat Stats',
        value: `**K/D Ratio:** ${stats.combatStats?.kdRatio || 'N/A'}\n**Total Kills:** ${stats.combatStats?.totalKills || 'N/A'}\n**Headshot %:** ${stats.combatStats?.headshotPercentage || 0}%`,
        inline: true
      },
      {
        name: 'Ranked Stats',
        value: `**Ranked Matches:** ${stats.rankedStats?.rankedMatches || 'N/A'}\n**Ranked K/D:** ${stats.rankedStats?.rankedKD || 'N/A'}\n**Ranked Win Rate:** ${stats.rankedStats?.rankedWinRate || 0}%`,
        inline: true
      }
    );
  } else if (dataSource === 'Ubisoft') {
    const rankedData = stats.ranked;
    
    if (rankedData && rankedData.profile && rankedData.season_statistics) {
      const profile = rankedData.profile;
      const seasonStats = rankedData.season_statistics;
      
      const totalMatches = (seasonStats.match_outcomes.wins || 0) + (seasonStats.match_outcomes.losses || 0);
      const winRate = totalMatches > 0 ? Math.round((seasonStats.match_outcomes.wins / totalMatches) * 100) : 0;
      const kd = seasonStats.deaths > 0 ? Math.round((seasonStats.kills / seasonStats.deaths) * 100) / 100 : seasonStats.kills;
      
      fields.push(
        {
          name: 'Ranked Profile',
          value: `**Rank:** ${getRankName(profile.rank)}\n**Points:** ${profile.rank_points}\n**Max Rank:** ${getRankName(profile.max_rank)}`,
          inline: true
        },
        {
          name: 'Performance',
          value: `**K/D:** ${kd}\n**Win Rate:** ${winRate}%\n**Matches:** ${totalMatches}`,
          inline: true
        },
        {
          name: 'Combat Stats',
          value: `**Kills:** ${seasonStats.kills}\n**Deaths:** ${seasonStats.deaths}\n**Wins:** ${seasonStats.match_outcomes.wins}\n**Losses:** ${seasonStats.match_outcomes.losses}`,
          inline: true
        }
      );
    } else {
      // Fallback to standard stats if ranked not available
      const standardData = stats.standard;
      if (standardData && standardData.season_statistics) {
        const seasonStats = standardData.season_statistics;
        const totalMatches = (seasonStats.match_outcomes.wins || 0) + (seasonStats.match_outcomes.losses || 0);
        const winRate = totalMatches > 0 ? Math.round((seasonStats.match_outcomes.wins / totalMatches) * 100) : 0;
        const kd = seasonStats.deaths > 0 ? Math.round((seasonStats.kills / seasonStats.deaths) * 100) / 100 : seasonStats.kills;
        
        fields.push({
          name: 'Standard Stats',
          value: `**K/D:** ${kd}\n**Win Rate:** ${winRate}%\n**Matches:** ${totalMatches}\n**Kills:** ${seasonStats.kills}\n**Deaths:** ${seasonStats.deaths}`,
          inline: false
        });
      } else {
        fields.push({
          name: 'No Data',
          value: 'No ranked or standard stats available.',
          inline: false
        });
      }
    }
  }

  return fields;
}

function getRankName(rankNumber) {
  const ranks = {
    0: 'Unranked',
    1: 'Copper V', 2: 'Copper IV', 3: 'Copper III', 4: 'Copper II', 5: 'Copper I',
    6: 'Bronze V', 7: 'Bronze IV', 8: 'Bronze III', 9: 'Bronze II', 10: 'Bronze I',
    11: 'Silver V', 12: 'Silver IV', 13: 'Silver III', 14: 'Silver II', 15: 'Silver I',
    16: 'Gold V', 17: 'Gold IV', 18: 'Gold III', 19: 'Gold II', 20: 'Gold I',
    21: 'Platinum V', 22: 'Platinum IV', 23: 'Platinum III', 24: 'Platinum II', 25: 'Platinum I',
    26: 'Emerald V', 27: 'Emerald IV', 28: 'Emerald III', 29: 'Emerald II', 30: 'Emerald I',
    31: 'Diamond V', 32: 'Diamond IV', 33: 'Diamond III', 34: 'Diamond II', 35: 'Diamond I',
    36: 'Champion'
  };
  
  return ranks[rankNumber] || 'Unknown Rank';
}

module.exports = createDiscordR6Webhook;