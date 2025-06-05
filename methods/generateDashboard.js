const fs = require('fs-extra').promises;
const path = require('path');
const getStats = require('./getStats');
const getOperators = require('./getOperators');
const getMaps = require('./getMaps');
const { generateTemplate } = require('./dashboardTemplates/defaultTemplate');
const { themes } = require('./dashboardTemplates/themes');

/**
 * Generate a customizable HTML dashboard with player statistics
 * @param {Object} params - Dashboard configuration
 * 
 * === REQUIRED PARAMETERS ===
 * @param {string} params.email - Ubisoft account email
 * @param {string} params.password - Ubisoft account password
 * @param {string} params.nameOnPlatform - Player name on platform
 * @param {string} params.platformType - Platform type (uplay, psn, xbl)
 * 
 * === OPTIONAL CONFIGURATION ===
 * @param {string} [params.platform_families='pc'] - Platform: "pc" or "console"
 * @param {string} [params.outputPath='./r6-dashboard.html'] - Output file path
 * @param {string} [params.theme='dark'] - Theme: 'dark', 'light', 'neon', 'military'
 * 
 * === CONTENT OPTIONS ===
 * @param {boolean} [params.includeCharts=true] - Show interactive charts
 * @param {boolean} [params.includeOperatorStats=false] - Show operator statistics
 * @param {boolean} [params.includeMapStats=false] - Show map statistics
 * @param {boolean} [params.includeRankedStats=true] - Show ranked statistics
 * @param {boolean} [params.includeCasualStats=true] - Show casual statistics
 * @param {boolean} [params.includeRankSection=true] - Show current rank section
 * @param {boolean} [params.includePlayerInfo=true] - Show player account info
 * 
 * === ADVANCED OPTIONS ===
 * @param {Object} [params.customization] - Custom styling and layout options
 * @param {string} [params.customization.title] - Custom dashboard title
 * @param {string} [params.customization.logo] - Custom logo URL
 * @param {boolean} [params.customization.showFooter=true] - Show footer
 * @param {boolean} [params.customization.showTimestamp=true] - Show generation time
 * @param {Array} [params.customization.hiddenStats] - Array of stat names to hide
 * 
 * @returns {Promise<string>} - Path to generated dashboard
 */
async function generateDashboard({
  // Required parameters
  email,
  password,
  nameOnPlatform,
  platformType,
  
  // Basic configuration
  platform_families = 'pc',
  outputPath = './r6-dashboard.html',
  theme = 'dark',
  
  // Content options
  includeCharts = true,
  includeOperatorStats = false,
  includeMapStats = false,
  includeRankedStats = true,
  includeCasualStats = true,
  includeRankSection = true,
  includePlayerInfo = true,
  
  // Advanced customization
  customization = {}
} = {}) {
  try {
    console.log(`🎨 Generating dashboard for ${nameOnPlatform}...`);
    console.log(`⚙️  Configuration: Theme=${theme}, Charts=${includeCharts}, Operators=${includeOperatorStats}, Maps=${includeMapStats}`);

    // Validate required parameters
    if (!email || !password || !nameOnPlatform || !platformType) {
      throw new Error('Missing required parameters: email, password, nameOnPlatform, platformType');
    }

    // Validate theme
    if (!themes[theme]) {
      throw new Error(`Theme '${theme}' not found. Available themes: ${Object.keys(themes).join(', ')}`);
    }

    // Set default customization options
    const config = {
      title: customization.title || `${nameOnPlatform}'s R6 Dashboard`,
      logo: customization.logo || null,
      showFooter: customization.showFooter !== false,
      showTimestamp: customization.showTimestamp !== false,
      hiddenStats: customization.hiddenStats || [],
      ...customization
    };

    // Fetch required data based on configuration
    const dashboardData = await fetchDashboardData({
      email,
      password,
      nameOnPlatform,
      platformType,
      platform_families,
      includeOperatorStats,
      includeMapStats,
      includeRankedStats,
      includeCasualStats,
      includePlayerInfo
    });

    // Add player name to data
    dashboardData.playerName = nameOnPlatform;

    // Generate HTML content
    const htmlContent = generateTemplate({
      playerData: dashboardData,
      theme: themes[theme],
      config: {
        includeCharts,
        includeOperatorStats,
        includeMapStats,
        includeRankedStats,
        includeCasualStats,
        includeRankSection,
        includePlayerInfo,
        customization: config
      }
    });

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Write HTML file
    await fs.writeFile(outputPath, htmlContent, 'utf8');

    // Success message with configuration summary
    console.log(`✅ Dashboard generated successfully!`);
    console.log(`📁 Path: ${outputPath}`);
    console.log(`📊 Player: ${nameOnPlatform}`);
    console.log(`🎨 Theme: ${theme}`);
    console.log(`📈 Charts: ${includeCharts ? '✓' : '✗'}`);
    console.log(`🎭 Operators: ${includeOperatorStats ? '✓' : '✗'}`);
    console.log(`🗺️  Maps: ${includeMapStats ? '✓' : '✗'}`);
    console.log(`💾 Size: ${(htmlContent.length / 1024).toFixed(2)} KB`);

    return outputPath;

  } catch (error) {
    console.error('❌ Error generating dashboard:', error.message);
    throw error;
  }
}

/**
 * Fetch data based on configuration
 */
async function fetchDashboardData({
  email,
  password,
  nameOnPlatform,
  platformType,
  platform_families,
  includeOperatorStats,
  includeMapStats,
  includeRankedStats,
  includeCasualStats,
  includePlayerInfo
}) {
  console.log('📡 Fetching dashboard data...');

  const results = {
    generatedAt: new Date().toISOString()
  };

  try {
    // Fetch ranked stats if requested
    if (includeRankedStats) {
      console.log('🏆 Fetching ranked statistics...');
      results.rankedStats = await getStats({
        type: 'stats',
        email,
        password,
        nameOnPlatform,
        platformType,
        platform_families,
        board_id: 'ranked'
      });
    }

    // Fetch casual stats if requested
    if (includeCasualStats) {
      console.log('🎮 Fetching casual statistics...');
      results.casualStats = await getStats({
        type: 'stats',
        email,
        password,
        nameOnPlatform,
        platformType,
        platform_families,
        board_id: 'casual'
      });
    }

    // Fetch account info if requested
    if (includePlayerInfo) {
      console.log('👤 Fetching account information...');
      try {
        results.playerInfo = await getStats({
          type: 'accountInfo',
          email,
          password,
          nameOnPlatform,
          platformType
        });
      } catch (error) {
        console.warn('⚠️  Could not fetch account info:', error.message);
        results.playerInfo = null;
      }
    }

    // Fetch operators data if requested
    if (includeOperatorStats) {
      console.log('🎭 Fetching operators data...');
      try {
        results.operators = await getOperators();
      } catch (error) {
        console.warn('⚠️  Could not fetch operators:', error.message);
        results.operators = null;
      }
    }

    // Fetch maps data if requested
    if (includeMapStats) {
      console.log('🗺️ Fetching maps data...');
      try {
        results.maps = await getMaps();
      } catch (error) {
        console.warn('⚠️  Could not fetch maps:', error.message);
        results.maps = null;
      }
    }

    return results;

  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    throw error;
  }
}

module.exports = { generateDashboard };