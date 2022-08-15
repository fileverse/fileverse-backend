const ErrorHandler = require('../../infra/utils/errorHandler');
const config = require('../../../config');
const axios = require('axios');

async function switchRecording({
  streamId,
  ownerAddress,
  reqAddress,
  record = false,
}) {
  ownerAddress = ownerAddress.toLowerCase();
  if (reqAddress !== ownerAddress) {
    return ErrorHandler.throwError({
      code: 403,
      message: 'You do not own this stream',
    });
  }

  const { data } = await axios.patch(
    `${config.LIVEPEER_BASE_URL}/api/stream/${streamId}/record`,
    { record },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.LP_API_KEY}`,
      },
    },
  );

  return data;
}

module.exports = switchRecording;
