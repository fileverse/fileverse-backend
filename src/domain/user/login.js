const createAccount = require('./createAccount');
const { ethers } = require('ethers');
const config = require('../../../config');
const Encryption = require('../../infra/utils/encryption');

async function verifySignature({ address, message, signature }) {
  const adr = await ethers.utils.verifyMessage(message, signature);
  return adr.toLowerCase() === address.toLowerCase();
}

async function getAuthToken({ address }) {
  const userId = await createAccount({ address });
  const encryption = new Encryption(config.JWT_SECRET);
  return encryption.signToken({ address: address.toLowerCase(), userId });
}

async function login({ address, signature, message }) {
  const isSignatureValid = await verifySignature({
    address,
    message,
    signature,
  });
  if (!isSignatureValid) {
    return null;
  }
  return { token: await getAuthToken({ address }) };
}

module.exports = login;
