const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util'); 

async function getCharms(apiKey, { name, collection, rarity, availability, bundle, season } = {}) {
  try {
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }

    const url = buildUrlAndParams('/charms', { name, collection, rarity, availability, bundle, season });

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('Errore during the getCharms request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getCharms;
