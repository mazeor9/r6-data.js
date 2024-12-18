const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

async function getSeasons({ name, map, operators, weapons, description, code, startDate } = {}) {
  try {
    
    const url = buildUrlAndParams('/seasons', { name, map, operators, weapons, description, code, startDate });

    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    console.error('Error during the getSeasons request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Token expired or invalid');
    }
    throw error;
  }
}

module.exports = getSeasons;
