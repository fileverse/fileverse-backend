const ErrorHandler = require('../../../infra/utils/errorHandler');
const https = require('https');
const { decryptStream } = require('../../../infra/utils/stream');
const { Readable } = require('stream');
const config = require('../../../../config');

async function download(req, res) {
  const url = req.query.url;
  const ipfsAddress = config.IPFS_URL_SCHEMA;
  const s3Address = config.S3_URL_SCHEMA;
  if (!url.startsWith(ipfsAddress) && !url.startsWith(s3Address)) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'URL invalid!',
    });
  }
  try {
    await https.get(url, function (response) {
      let stream = Readable.from(response);
      let decryptedStream = Readable.from(decryptStream(stream));
      res.writeHead(200, {
        'Content-Type': 'image/jpeg',
      });
      decryptedStream.pipe(res);
    });
  } catch (err) {
    return ErrorHandler.throwError({
      code: 404,
      message: err,
    });
  }
}

module.exports = [download];
