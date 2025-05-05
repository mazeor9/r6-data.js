const getMaps = require('./methods/getMaps');
const getOperators = require('./methods/getOperators');
const getRanks = require('./methods/getRanks');
const getSeasons = require('./methods/getSeasons');
const getServiceSatus = require('./methods/getServiceStatus');
const getAttachment = require('./methods/getAttachment');
const getCharms = require('./methods/getCharms');
const getWeapons = require('./methods/getWeapons');
const getUniversalSkins = require('./methods/getUniversalSkins');

const r6Info = {
  getMaps,
  getOperators,
  getRanks,
  getSeasons,
  getServiceSatus,
  getAttachment,
  getCharms,
  getWeapons,
  getUniversalSkins,
};

module.exports = r6Info;