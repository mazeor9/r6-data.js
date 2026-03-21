const axios = require('axios');
const pkg = require('../../package.json');

function createHttpClient(apiKey) {
  return axios.create({
    baseURL: 'https://api.r6data.eu/api',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'User-Agent': `r6-data.js/${pkg.version}`,
      'api-key': apiKey
    },
  });
}

module.exports = createHttpClient;
