const axios = require('axios');

exports.handler = async () => {
  try {
    const res = await axios.get('https://httpbin.org/status/200', { timeout: 4000 });
    const isOnline = res.status === 200;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: 'Petlibro',
        status: isOnline ? 'online' : 'outage',
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand: 'Petlibro',
        status: 'outage',
        timestamp: new Date().toISOString()
      })
    };
  }
};
