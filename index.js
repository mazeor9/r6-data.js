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
const getStats = require('./methods/getStats');
const { generateDashboard } = require('./methods/generateDashboard');

const r6Info = {
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
  getStats,
  generateDashboard,
};

module.exports = r6Info;