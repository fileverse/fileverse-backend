const createSession = require('./createSession');
const createAccount = require('./createAccount');
const { ethers } = require('ethers');
const config = require('../../../config');
const Encryption = require('../../infra/utils/encryption');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function verifySignature({ address, message, signature }) {
  const adr = await ethers.utils.verifyMessage(message, signature);
  return adr.toLowerCase() === address.toLowerCase();
}

async function getAuthToken({ address, userId, sessionId, subdomain }) {
  const encryption = new Encryption(config.JWT_SECRET);
  const tokenContent = {
    address: address.toLowerCase(),
    userId,
    sessionId,
  };
  if (subdomain) {
    tokenContent.subdomain = subdomain.toLowerCase();
  }
  return encryption.signToken(tokenContent);
}

async function login({ address, signature, message, subdomain }) {
  const isSignatureValid = await verifySignature({
    address,
    message,
    signature,
  });
  if (!isSignatureValid) {
    return ErrorHandler.throwError({
      code: 400,
      message: `Signature is not valid for address: ${address}`,
    });
  }
  const userId = await createAccount({ address, subdomain });
  const sessionId = await createSession({ address, userId, subdomain });
  return {
    token: await getAuthToken({ address, userId, sessionId, subdomain }),
    userId,
  };
}

module.exports = login;
