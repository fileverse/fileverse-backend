const ErrorHandler = require('../../../infra/utils/errorHandler');
const https = require('https');
const { decryptStream } = require('../../../infra/utils/stream');
const { Readable } = require('stream');

async function download(req, res) {
  const url = req.query.url;
  const ipfsAddress = 'https://ipfs.fileverse.io/ipfs';
  const s3Address =
    'https://s3.eu-west-2.amazonaws.com/dev-s3.fileverse.io/files';
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
