const crypto = require('crypto');
const config = require('../../../config');
const algorithm = config.ENCRYPTION_ALGORITHM;

const encryptStream = (stream, password) => {
  let encrypt = crypto.createCipher(algorithm, password);
  return stream.pipe(encrypt);
};

const encryptString = (string, password) => {
  let encrypt = crypto.createCipher(algorithm, password);
  let encrypted = encrypt.update(string, 'utf8', 'hex');
  encrypted += encrypt.final('hex');
  return encrypted;
};

const decryptString = (encryptedString, password) => {
  let decrypt = crypto.createDecipher(algorithm, password);
  let decrypted = decrypt.update(encryptedString, 'hex', 'utf8');
  decrypted += decrypt.final('utf8');
  return decrypted;
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
