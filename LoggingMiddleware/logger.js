const axios = require('axios');

async function log(stack, level, packageName, message, token) {
  const payload = {
    stack: stack.toLowerCase(),
    level: level.toLowerCase(),
    package: packageName.toLowerCase(),
    message
  };

  try {
    const response = await axios.post(
      'http://20.244.56.144/log',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Log success:', response.data);
  } catch (error) {
    console.error('Log error:', error.response?.data || error.message);
  }
}

module.exports = log;
