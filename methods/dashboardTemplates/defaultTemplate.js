const { generateChartScript } = require('./chartHelpers');

function generateTemplate({ playerData, theme, config }) {
  const extractedStats = extractPlayerStats(playerData);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.customization.title}</title>
    ${config.includeCharts ? '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>' : ''}
    <style>
        ${generateCSS(theme, config.customization)}
    </style>
</head>
<body>
    <div class="dashboard-container">
        ${generateHeader(extractedStats, config)}
        ${generateMainContent(extractedStats, config)}
        ${config.customization.showFooter ? generateFooter(extractedStats) : ''}
    </div>

    <script>
        ${config.includeCharts ? generateChartScript(extractedStats) : ''}
        ${generateInteractiveScript()}
    </script>
</body>
</html>`;
}

function generateMainContent(stats, config) {
  let content = '';

  // Stats Overview Section
  if (config.includeRankedStats || config.includeCasualStats) {
    content += '<div class="stats-grid">';
    
    if (config.includeRankedStats) {
      content += generateRankedStatsCard(stats, config);
    }
    
    if (config.includeCasualStats) {
      content += generateCasualStatsCard(stats, config);
    }
    
    content += '</div>';
  }

  // Rank Section
  if (config.includeRankSection && config.includeRankedStats) {
    content += generateRankSection(stats);
  }

  // Charts Section
  if (config.includeCharts) {
    content += generateChartsSection(stats, config);
  }

  // Operator Section
  if (config.includeOperatorStats) {
    content += generateOperatorSection(stats);
  }

  // Map Section
  if (config.includeMapStats) {
    content += generateMapSection(stats);
  }

  return content;
}

function generateRankedStatsCard(stats, config) {
  const hiddenStats = config.customization.hiddenStats || [];
  
  return `
    <div class="stat-card">
        <h3 class="card-title">🏆 Ranked Statistics</h3>
        ${!hiddenStats.includes('kills') ? `
        <div class="stat-row">
            <span class="stat-label">Kills</span>
            <span class="stat-value">${stats.ranked.kills || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('deaths') ? `
        <div class="stat-row">
            <span class="stat-label">Deaths</span>
            <span class="stat-value">${stats.ranked.deaths || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('kd') ? `
        <div class="stat-row">
            <span class="stat-label">K/D Ratio</span>
            <span class="stat-value">${stats.calculated.rankedKD || '0.00'}</span>
        </div>` : ''}
        ${!hiddenStats.includes('wins') ? `
        <div class="stat-row">
            <span class="stat-label">Wins</span>
            <span class="stat-value">${stats.ranked.wins || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('losses') ? `
        <div class="stat-row">
            <span class="stat-label">Losses</span>
            <span class="stat-value">${stats.ranked.losses || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('winrate') ? `
        <div class="stat-row">
            <span class="stat-label">Win Rate</span>
            <span class="stat-value">${stats.calculated.rankedWinRate || '0.0'}%</span>
        </div>` : ''}
    </div>
  `;
}

function generateCasualStatsCard(stats, config) {
  const hiddenStats = config.customization.hiddenStats || [];
  
  return `
    <div class="stat-card">
        <h3 class="card-title">🎮 Casual Statistics</h3>
        ${!hiddenStats.includes('kills') ? `
        <div class="stat-row">
            <span class="stat-label">Kills</span>
            <span class="stat-value">${stats.casual.kills || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('deaths') ? `
        <div class="stat-row">
            <span class="stat-label">Deaths</span>
            <span class="stat-value">${stats.casual.deaths || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('kd') ? `
        <div class="stat-row">
            <span class="stat-label">K/D Ratio</span>
            <span class="stat-value">${stats.calculated.casualKD || '0.00'}</span>
        </div>` : ''}
        ${!hiddenStats.includes('wins') ? `
        <div class="stat-row">
            <span class="stat-label">Wins</span>
            <span class="stat-value">${stats.casual.wins || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('losses') ? `
        <div class="stat-row">
            <span class="stat-label">Losses</span>
            <span class="stat-value">${stats.casual.losses || 0}</span>
        </div>` : ''}
        ${!hiddenStats.includes('winrate') ? `
        <div class="stat-row">
            <span class="stat-label">Win Rate</span>
            <span class="stat-value">${stats.calculated.casualWinRate || '0.0'}%</span>
        </div>` : ''}
    </div>
  `;
}

function generateHeader(stats, config) {
  return `
    <div class="header">
        ${config.customization.logo ? `<img src="${config.customization.logo}" alt="Logo" class="dashboard-logo">` : ''}
        <h1 class="player-name">${stats.playerName}</h1>
        ${config.customization.showTimestamp ? `
        <p class="last-updated">Dashboard generated: ${new Date(stats.generatedAt).toLocaleString()}</p>
        ` : ''}
    </div>
  `;
}

function generateChartsSection(stats, config) {
  if (!config.includeCharts) return '';
  
  let charts = '';
  
  if (config.includeRankedStats && config.includeCasualStats) {
    charts += `
      <div class="chart-container">
          <h3 class="chart-title">K/D Comparison</h3>
          <canvas id="kdChart" width="400" height="200"></canvas>
      </div>
    `;
  }
  
  if (config.includeRankedStats) {
    charts += `
      <div class="chart-container">
          <h3 class="chart-title">Win Rate Analysis</h3>
          <canvas id="winRateChart" width="400" height="200"></canvas>
      </div>
    `;
  }
  
  if (config.includeRankedStats || config.includeCasualStats) {
    charts += `
      <div class="chart-container">
          <h3 class="chart-title">Match Outcomes</h3>
          <canvas id="matchChart" width="400" height="200"></canvas>
      </div>
    `;
  }

  return `
    <div class="charts-section">
        <h2 class="card-title" style="text-align: center; font-size: 2em; margin-bottom: 30px;">📊 Performance Analytics</h2>
        ${charts}
    </div>
  `;
}

// Resto delle funzioni rimangono uguali...
function generateRankSection(stats) {
  const rankNames = {
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

  const currentRank = rankNames[stats.ranked.rank] || 'Unknown';
  const maxRank = rankNames[stats.ranked.maxRank] || 'Unknown';

  return `
    <div class="rank-section">
        <h2 style="color: white; margin-bottom: 20px;">🏅 Current Season Rank</h2>
        <div class="rank-display">${currentRank}</div>
        <div class="rank-points">${stats.ranked.rankPoints || 0} MMR</div>
        <div style="margin-top: 20px;">
            <p style="font-size: 1.2em; color: #ccc;">Season High: <strong style="color: #ffd700;">${maxRank}</strong></p>
            <p style="font-size: 1.1em; color: #ccc;">Max MMR: <strong>${stats.ranked.maxRankPoints || 0}</strong></p>
        </div>
    </div>
  `;
}

function generateOperatorSection(stats) {
  return `
    <div class="stat-card">
        <h3 class="card-title">🎭 Operator Performance</h3>
        <p style="text-align: center; color: #ccc; font-style: italic;">
            Detailed operator statistics coming soon...
        </p>
    </div>
  `;
}

function generateMapSection(stats) {
  return `
    <div class="stat-card">
        <h3 class="card-title">🗺️ Map Performance</h3>
        <p style="text-align: center; color: #ccc; font-style: italic;">
            Map-specific statistics coming soon...
        </p>
    </div>
  `;
}

function generateFooter(stats) {
  return `
    <div class="footer">
        <div class="footer-logo">R6-INFO.js Dashboard</div>
        <p>Generated with ❤️ by r6-info.js package</p>
        <p>Follow us on GitHub: <a href="https://github.com/mazeor7/r6-info.js" target="_blank" style="color: #ffd700;">@mazeor7/r6-info.js</a></p>
    </div>
  `;
}

function extractPlayerStats(playerData) {
  try {
    const rankedData = playerData.rankedStats?.platform_families_full_profiles?.[0]?.board_ids_full_profiles?.find(b => b.board_id === 'ranked');
    const casualData = playerData.casualStats?.platform_families_full_profiles?.[0]?.board_ids_full_profiles?.find(b => b.board_id === 'casual');
    
    const rankedProfile = rankedData?.full_profiles?.[0];
    const casualProfile = casualData?.full_profiles?.[0];
    
    return {
      playerName: playerData.playerName || 'Unknown Player',
      generatedAt: playerData.generatedAt,
      
      ranked: {
        rank: rankedProfile?.profile?.rank || 0,
        maxRank: rankedProfile?.profile?.max_rank || 0,
        rankPoints: rankedProfile?.profile?.rank_points || 0,
        maxRankPoints: rankedProfile?.profile?.max_rank_points || 0,
        kills: rankedProfile?.season_statistics?.kills || 0,
        deaths: rankedProfile?.season_statistics?.deaths || 0,
        wins: rankedProfile?.season_statistics?.match_outcomes?.wins || 0,
        losses: rankedProfile?.season_statistics?.match_outcomes?.losses || 0,
        abandons: rankedProfile?.season_statistics?.match_outcomes?.abandons || 0,
      },
      
      casual: {
        kills: casualProfile?.season_statistics?.kills || 0,
        deaths: casualProfile?.season_statistics?.deaths || 0,
        wins: casualProfile?.season_statistics?.match_outcomes?.wins || 0,
        losses: casualProfile?.season_statistics?.match_outcomes?.losses || 0,
      },
      
      calculated: {
        rankedKD: rankedProfile?.season_statistics?.deaths > 0 ? 
          (rankedProfile.season_statistics.kills / rankedProfile.season_statistics.deaths).toFixed(2) : 
          rankedProfile?.season_statistics?.kills || 0,
        casualKD: casualProfile?.season_statistics?.deaths > 0 ? 
          (casualProfile.season_statistics.kills / casualProfile.season_statistics.deaths).toFixed(2) : 
          casualProfile?.season_statistics?.kills || 0,
        rankedWinRate: rankedProfile?.season_statistics?.match_outcomes ? 
          ((rankedProfile.season_statistics.match_outcomes.wins / 
            (rankedProfile.season_statistics.match_outcomes.wins + rankedProfile.season_statistics.match_outcomes.losses)) * 100).toFixed(1) : 0,
        casualWinRate: casualProfile?.season_statistics?.match_outcomes ? 
          ((casualProfile.season_statistics.match_outcomes.wins / 
            (casualProfile.season_statistics.match_outcomes.wins + casualProfile.season_statistics.match_outcomes.losses)) * 100).toFixed(1) : 0,
      }
    };
  } catch (error) {
    console.error('Error extracting player stats:', error);
    return {
      playerName: playerData.playerName || 'Error Loading Player',
      generatedAt: new Date().toISOString(),
      ranked: {},
      casual: {},
      calculated: {}
    };
  }
}

function generateCSS(theme, customization) {
  return `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: ${theme.background};
        color: ${theme.textColor};
        line-height: 1.6;
        overflow-x: hidden;
    }

    .dashboard-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 20px;
        background: ${theme.containerBackground};
        min-height: 100vh;
    }

    .header {
        text-align: center;
        padding: 30px 0;
        border-bottom: 3px solid ${theme.accent};
        margin-bottom: 30px;
        background: ${theme.headerBackground};
        border-radius: 15px;
        box-shadow: ${theme.boxShadow};
    }

    .dashboard-logo {
        max-height: 60px;
        margin-bottom: 15px;
    }

    .player-name {
        font-size: 3em;
        font-weight: bold;
        color: ${theme.accent};
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        margin-bottom: 10px;
    }

    .last-updated {
        color: ${theme.mutedText};
        font-size: 1.1em;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin: 30px 0;
    }

    .stat-card {
        background: ${theme.cardBackground};
        border-radius: 15px;
        padding: 25px;
        box-shadow: ${theme.boxShadow};
        border: 2px solid ${theme.borderColor};
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .stat-card:hover {
        transform: translateY(-5px);
        box-shadow: ${theme.hoverShadow};
        border-color: ${theme.accent};
    }

    .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, ${theme.accent}, ${theme.secondary});
    }

    .card-title {
        font-size: 1.4em;
        font-weight: bold;
        color: ${theme.accent};
        margin-bottom: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid ${theme.borderColor};
    }

    .stat-row:last-child {
        border-bottom: none;
    }

    .stat-label {
        font-weight: 600;
        color: ${theme.textColor};
    }

    .stat-value {
        font-weight: bold;
        color: ${theme.accent};
        font-size: 1.2em;
    }

    .rank-section {
        background: linear-gradient(135deg, ${theme.accent}20, ${theme.secondary}20);
        border-radius: 20px;
        padding: 30px;
        margin: 30px 0;
        text-align: center;
        border: 2px solid ${theme.accent};
    }

    .rank-display {
        font-size: 4em;
        font-weight: bold;
        color: ${theme.accent};
        text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
        margin: 20px 0;
    }

    .rank-points {
        font-size: 1.5em;
        color: ${theme.secondary};
        margin: 10px 0;
    }

    .charts-section {
        margin: 40px 0;
    }

    .chart-container {
        background: ${theme.cardBackground};
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: ${theme.boxShadow};
        border: 2px solid ${theme.borderColor};
    }

    .chart-title {
        font-size: 1.5em;
        color: ${theme.accent};
        margin-bottom: 20px;
        text-align: center;
        font-weight: bold;
    }

    .footer {
        text-align: center;
        padding: 30px;
        margin-top: 50px;
        border-top: 2px solid ${theme.borderColor};
        color: ${theme.mutedText};
    }

    .footer-logo {
        font-size: 1.2em;
        font-weight: bold;
        color: ${theme.accent};
        margin-bottom: 10px;
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }
        
        .player-name {
            font-size: 2em;
        }
        
        .rank-display {
            font-size: 2.5em;
        }
        
        .dashboard-container {
            padding: 10px;
        }
    }
  `;
}

function generateInteractiveScript() {
  return `
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    document.addEventListener('DOMContentLoaded', function() {
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });

    console.log('🎮 R6 Dashboard loaded successfully!');
  `;
}

module.exports = { generateTemplate };