const axiosInstance = require('../axiosInstance/axiosInstance');

async function getServiceStatus(apiKey) {
  try {
    if (!apiKey) {
      throw new Error('Missing required parameter: apiKey');
    }

    let url = '/serviceStatus';
    const response = await axiosInstance.get(url, {
      headers: {
        'api-key': apiKey
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error during the service status request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('request error');
    }
    throw error;
  }
}

module.exports = getServiceStatus;
