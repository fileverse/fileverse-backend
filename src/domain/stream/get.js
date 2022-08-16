const config = require('../../../config');
const axios = require('axios');
const sessions = require('./sessions');

async function get({ streamId, ownerAddress, reqAddress }) {
  // get stream data
  const { data } = await axios.get(
    `${config.LIVEPEER_BASE_URL}/api/stream/${streamId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.LP_API_KEY}`,
      },
    },
  );
  let streamData = {
    name: data.name,
    lastSeen: data.lastSeen,
    isActive: data.isActive,
    id: data.id,
    profiles: data.profiles,
    createdAt: data.createdAt,
    playbackId: data.playbackId,
    playbackUrl: `https://livepeercdn.com/hls/${data.playbackId}/index.m3u8`,
  };
  ownerAddress = ownerAddress.toLowerCase();
  if (ownerAddress === reqAddress) {
    streamData = {
      ...streamData,
      streamKey: data.streamKey,
      record: data.record,
    };
  }

  //get latest recorded session, if any
  const session = await sessions(streamId);
  if (session.length > 0) {
    streamData = { ...streamData, lastRecordedSession: session[0] };
  }

  return streamData;
}

module.exports = get;
