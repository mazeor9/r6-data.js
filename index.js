const getMaps = require('./methods/getMaps');
const getOperators = require('./methods/getOperators');
const getRanks = require('./methods/getRanks');
const getSeasons = require('./methods/getSeasons');
const getServiceSatus = require('./methods/getServiceStatus');
const getAttachment = require('./methods/getAttachment');
const getCharms = require('./methods/getCharms');

const r6Info = {
  getMaps,
  getOperators,
  getRanks,
  getSeasons,
  getServiceSatus,
  getAttachment,
  getCharms,
};

module.exports = r6Info;