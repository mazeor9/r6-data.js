const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util'); 

async function getCharms({ name, collection, rarity, availability, bundle, season } = {}) {
  try {

    const url = buildUrlAndParams('/charms', { name, collection, rarity, availability, bundle, season });

    const response = await axiosInstance.get(url);

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
