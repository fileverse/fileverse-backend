const { File, Account } = require('../../infra/database/models');

async function getByAccount(address) {
  const account = await Account.findOne({ address });
  const foundFiles = await File.find({
    owner: account._id,
  });
  return foundFiles.map((elem) => elem.safeObject());
}

module.exports = getByAccount;
