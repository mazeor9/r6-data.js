const axiosInstance = require('../axiosInstance/axiosInstance');

async function generateToken(userId) {
  try {
    const response = await axiosInstance.post('/token', { userId });
    return response.data.token;
  } catch (error) {
    console.error('Error during the token request:', error.message);
    throw error;
  }
}

async function isValidToken(token, userId) {
  try {
    const response = await axiosInstance.post('/tokenManagement', { action: 'verify', userId }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.isValid;
  } catch (error) {
    console.error('Error during token validation:', error.message);
    throw error;
  }
}

async function getToken(userId) {
  try {
    const response = await axiosInstance.get('/tokenManagement', { params: { action: 'getToken', userId } });
    return response.data.token;
  } catch (error) {
    console.error('Error while getting token:', error.message);
    throw error;
  }
}

module.exports = {
  generateToken,
  isValidToken,
  getToken,
};