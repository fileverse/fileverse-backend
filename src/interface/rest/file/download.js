const ErrorHandler = require('../../../infra/utils/errorHandler');
const https = require('https');
const { decryptStream } = require('../../../infra/utils/stream');
const { Readable } = require('stream');

async function download(req, res) {
  const url = req.query.url;
  const address = 'https://ipfs.fileverse.io/ipfs';
  if (!url.startsWith(address)) {
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
