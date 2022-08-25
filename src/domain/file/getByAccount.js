const { File, Account } = require('../../infra/database/models');

async function getByAccount({ address, page = 1 }) {
  const account = await Account.findOne({ address });
  const foundFiles = await File.find({
    owner: account._id,
  })
    .skip(10 * (page - 1))
    .limit(10);
  return foundFiles.map((elem) => elem.safeObject());
}

module.exports = getByAccount;
