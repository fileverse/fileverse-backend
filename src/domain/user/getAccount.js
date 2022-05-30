const { Account } = require('../../infra/database/models');

async function getAccount({ address }) {
  let foundAccount = await Account.findOne({ address });
  if (foundAccount) {
    return foundAccount.safeObject();
  }
  // find by username
  foundAccount = await Account.findOne({ username: address });
  if (foundAccount) {
    return foundAccount.safeObject();
  }
  const createdAccount = await new Account({ address }).save();
  return createdAccount.safeObject();
}

module.exports = getAccount;
