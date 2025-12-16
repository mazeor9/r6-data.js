const axios = require('axios');

const axiosInstance = axios.create({
    baseURL: 'https://api.r6data.eu/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
      },
});

module.exports = axiosInstance;