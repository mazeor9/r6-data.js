const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util'); 

async function getAttachment({ name, style, rarity, availability, bundle, season } = {}) {
  try {

    const url = buildUrlAndParams('/attachment', { name, style, rarity, availability, bundle, season });

    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    console.error('Error during the getAttachment request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getAttachment;
