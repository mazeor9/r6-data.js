const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util'); 

async function getWeapons(apiKey, { name } = {}) {
  try {
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }

    const url = buildUrlAndParams('/weapons', { name });

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error during the getWeapons request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getWeapons;
