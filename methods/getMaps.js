const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

async function getMaps({ name, location, releaseDate, playlists, mapReworked } = {}) {
  try {

    const url = buildUrlAndParams('/maps', { name, location, releaseDate, playlists, mapReworked });

    const response = await axiosInstance.get(url);

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