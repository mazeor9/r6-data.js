const getMaps = require('./methods/getMaps');
const getOperators = require('./methods/getOperators');
const getRanks = require('./methods/getRanks');
const getSeasons = require('./methods/getSeasons');
const getServiceStatus = require('./methods/getServiceStatus');
const getAttachment = require('./methods/getAttachment');
const getCharms = require('./methods/getCharms');
const getWeapons = require('./methods/getWeapons');
const getUniversalSkins = require('./methods/getUniversalSkins');
const getSearchAll = require('./methods/getSearchAll');
const getAccountInfo = require('./methods/getAccountInfo');
const getPlayerStats = require('./methods/getPlayerStats');
const createDiscordR6Webhook = require('./methods/createDiscordR6Webhook');
const getGameStats = require('./methods/getGameStats');
const getSeasonalStats = require('./methods/getSeasonalStats');

// Export individual functions for named imports
module.exports = {
  getMaps,
  getOperators,
  getRanks,
  getSeasons,
  getServiceStatus,
  getAttachment,
  getCharms,
  getWeapons,
  getUniversalSkins,
  getSearchAll,
  getAccountInfo,
  getPlayerStats,
  createDiscordR6Webhook,
  getGameStats,
  getSeasonalStats,
};

// Export individual functions as named exports for ES6 compatibility
module.exports.getMaps = getMaps;
module.exports.getOperators = getOperators;
module.exports.getRanks = getRanks;
module.exports.getSeasons = getSeasons;
module.exports.getServiceStatus = getServiceStatus;
module.exports.getAttachment = getAttachment;
module.exports.getCharms = getCharms;
module.exports.getWeapons = getWeapons;
module.exports.getUniversalSkins = getUniversalSkins;
module.exports.getSearchAll = getSearchAll;
module.exports.getAccountInfo = getAccountInfo;
module.exports.getPlayerStats = getPlayerStats;
module.exports.createDiscordR6Webhook = createDiscordR6Webhook;
module.exports.getGameStats = getGameStats;
module.exports.getSeasonalStats = getSeasonalStats;