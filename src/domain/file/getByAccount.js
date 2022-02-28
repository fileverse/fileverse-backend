const config = require('../../../config');
const { File, Account } = require('../../infra/database/models');

async function getByAccount(address, viewer) {
  const account = await Account.findOne({ address });
  const expiryDuration = parseInt(
    viewer
      ? config.FILE_EXPIRY_SECONDS_AUTHENTICATED
      : config.FILE_EXPIRY_SECONDS_UNAUTHENTICATED,
    10,
  );
  const allowedCreatedDate = new Date() - expiryDuration;
  const foundFiles = await File.find({
    owner: account._id,
    createdAt: { $lte: allowedCreatedDate },
  });
  return foundFiles.map((elem) => ({
    ...elem.safeObject(),
    expiresIn: elem.createdAt + expiryDuration,
  }));
}

module.exports = getByAccount;
