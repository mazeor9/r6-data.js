const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util'); 

async function getOperators({ name, safename, realname, birthplace, age, date_of_birth, season_introduced, health, speed, unit, country_code, roles, side } = {}) {
  try {

    const url = buildUrlAndParams('/operators', { name, safename, realname, birthplace, age, date_of_birth, season_introduced, health, speed, unit, country_code, roles, side });

    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    console.error('Error during the getOperators request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Token expired or invalid');
    }
    throw error;
  }
}

module.exports = getOperators;
