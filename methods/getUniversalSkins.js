const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util'); 

async function getUniversalSkins({ name } = {}) {
  try {

    const url = buildUrlAndParams('/universalSkins', { name });

    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    console.error('Error during the getUniversalSkins request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getUniversalSkins;
