const axiosInstance = require('../axiosInstance/axiosInstance');
const buildUrlAndParams = require('./util');

/**
 * Search across all R6 entities (operators, weapons, maps, etc.)
 * @param {string} query - The search term to query across all entities
 * @returns {Promise<Object>} - Search results organized by entity type
 */
async function getSearchAll(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('Search query is required and must be a string');
  }

  try {
    const url = buildUrlAndParams('/searchAll', { q: query });
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error during the getSearchAll request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Authentication error');
    }
    throw error;
  }
}

module.exports = getSearchAll;