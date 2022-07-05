const { Account } = require('./../../infra/database/models');

async function usernameExists({ username }) {
  const foundUser = await Account.findOne({ username });
  return foundUser == null;
}

module.exports = usernameExists;
