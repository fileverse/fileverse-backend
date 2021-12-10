const { Account } = require('../../infra/database/models');

async function getAccount({ address }) {
  const foundAccount = await Account.findOne({ address });
  if (foundAccount) {
    return foundAccount.safeObject();
  }
  const createdAccount = await new Account({ address }).save();
  return createdAccount.safeObject();
}

module.exports = getAccount;
