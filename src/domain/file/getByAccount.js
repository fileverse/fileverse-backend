const { File, Account } = require('../../infra/database/models');

async function getByAccount({ address, offset, limit }) {
  const account = await Account.findOne({ address });
  const foundFiles = await File.aggregate([
    { $match: { owner: account._id } },
    { $sort: { _id: -1 } },
    { $skip: offset },
    { $limit: limit },
  ]);
  return foundFiles.map((elem) => new File(elem).safeObject());
}

module.exports = getByAccount;
