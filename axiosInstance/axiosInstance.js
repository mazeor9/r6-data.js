const axios = require('axios');
const pkg = require('../package.json');

const axiosInstance = axios.create({
    baseURL: 'https://api.r6data.eu/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'User-Agent': `r6-data.js/${pkg.version}`,
      },
});

module.exports = axiosInstance;