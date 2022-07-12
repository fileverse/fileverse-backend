const crypto = require('crypto');
const config = require('../../../config');
const algorithm = config.ENCRYPTION_ALGORITHM;

const encryptStream = (stream, password) => {
  let encrypt = crypto.createCipher(algorithm, password);
  return stream.pipe(encrypt);
};

const encryptString = (string, password) => {
  let encrypt = crypto.createCipher(algorithm, password);
  return encrypt.update(string);
};

const decryptString = (encryptedString, password) => {
  let encrypt = crypto.createDecipher(algorithm, password);
  return encrypt.update(encryptedString);
};

const decryptStream = (stream, password) => {
  let decrypt = crypto.createDecipher(algorithm, password);
  return stream.pipe(decrypt);
};

module.exports = {
  encryptStream,
  decryptStream,
  encryptString,
  decryptString,
};
