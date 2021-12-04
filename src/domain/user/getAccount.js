const { User } = require('../../infra/database/models');

async function getAccount({ address }) {
  const foundUser = await User.findOne({ address });
  if (foundUser) {
    return foundUser.safeObject();
  }
  const createdUser = await new User({ address }).save();
  return createdUser.safeObject();
}

module.exports = getAccount;
