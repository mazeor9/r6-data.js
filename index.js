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

const r6Data = {
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
};

module.exports = r6Data;