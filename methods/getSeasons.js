const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

async function getSeasons(apiKey, { name, map, operators, weapons, description, code, startDate } = {}) {
  try {
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }
    
    const url = buildUrlAndParams('/seasons', { name, map, operators, weapons, description, code, startDate });

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error during the getSeasons request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getSeasons;
