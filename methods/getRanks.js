const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util'); 

async function getRanks(apiKey, { name, min_mmr, max_mmr, version } = {}) {
  try {
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }

    if (!['v1', 'v2', 'v3', 'v4', 'v5', 'v6'].includes(version)) {
      throw new Error('Version not valid. Choose between v1, v2, v3, v4, v5, and v6.');
    }

    const url = buildUrlAndParams('/ranks', { name, min_mmr, max_mmr, version });

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error during the getRanks request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getRanks;
