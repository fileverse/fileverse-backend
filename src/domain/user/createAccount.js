const { Account } = require('../../infra/database/models');

async function createAccount({ address }) {
  const foundAccount = await Account.findOne({ address });
  if (foundAccount) {
    return foundAccount._id;
  }
  const createdAccount = await new Account({ address }).save();
  return createdAccount._id;
}

module.exports = createAccount;
