const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const password = 'd6F3Efeq';

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
