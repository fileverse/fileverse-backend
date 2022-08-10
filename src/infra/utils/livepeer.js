const config = require('../../../config');
const axios = require('axios');

class Livepeer {
  async createStream({ name }) {
    const { data } = await axios.post(
      `${config.LIVEPEER_BASE_URL}/api/stream`,
      {
        name,
        profiles: [
          {
            name: '720p',
            bitrate: 2000000,
            fps: 30,
            width: 1280,
            height: 720,
          },
          {
            name: '480p',
            bitrate: 1000000,
            fps: 30,
            width: 854,
            height: 480,
          },
          {
            name: '360p',
            bitrate: 500000,
            fps: 30,
            width: 640,
            height: 360,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.LP_API_KEY}`,
        },
      },
    );
    return data;
  }
}

module.exports = Livepeer;
