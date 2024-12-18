const axiosInstance = require('../axiosInstance/axiosInstance');

async function getServiceStatus() {
  try {

    let url = '/serviceStatus';
    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error) {
    console.error('Error during the service status request:', error.message);
    if (error.response && error.response.status === 401) {
      throw new Error('Token expired or invalid');
    }
    throw error;
  }
}

module.exports = getServiceStatus;
