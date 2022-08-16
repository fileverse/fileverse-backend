const config = require('../../../config');
const axios = require('axios');

async function sessions(streamId) {
  const { data } = await axios.get(
    `${config.LIVEPEER_BASE_URL}/api/stream/${streamId}/sessions`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.LP_API_KEY}`,
      },
    },
  );
  return data;
}

module.exports = sessions;
