const crypto = require('crypto');
const config = require('../../../config');
const algorithm = config.ENCRYPTION_ALGORITHM;
const password = config.ENCRYPTION_KEY;

let encryptStream = (stream) => {
  let encrypt = crypto.createCipher(algorithm, password);
  return stream.pipe(encrypt);
};

let decryptStream = (stream) => {
  let decrypt = crypto.createDecipher(algorithm, password);
  return stream.pipe(decrypt);
};

module.exports = {
  encryptStream,
  decryptStream,
};
