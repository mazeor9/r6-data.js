const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

async function getMaps(apiKey, { name, location, releaseDate, playlists, mapReworked } = {}) {
  try {
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }

    const url = buildUrlAndParams('/maps', { name, location, releaseDate, playlists, mapReworked });

    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error during the getMaps request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getMaps;
