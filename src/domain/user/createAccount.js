const { User } = require('../../infra/database/models');

async function createAccount({ address }) {
  const foundUser = await User.findOne({ address });
  if (foundUser) {
    return foundUser._id;
  }
  const createdUser = await new User({ address }).save();
  return createdUser._id;
}

module.exports = createAccount;
