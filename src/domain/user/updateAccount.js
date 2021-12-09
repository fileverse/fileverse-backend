const ErrorHandler = require('../../infra/utils/errorHandler');
const { User } = require('../../infra/database/models');

async function updateAccount(userId, { name, username, email }) {
  let foundUser = await User.findOneById(userId);
  if (!foundUser) {
    return ErrorHandler.throwError({ code: 404, message: `User not found for id: ${userId}` });
  }
  foundUser.name = name;
  foundUser.username = username;
  foundUser.email = email;
  return foundUser.safeObject();
}

module.exports = updateAccount;
