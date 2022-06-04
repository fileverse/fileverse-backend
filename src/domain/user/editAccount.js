const ErrorHandler = require('../../infra/utils/errorHandler');
const { Account } = require('../../infra/database/models');
const usernameExists = require('./usernameExists');

function containsWhitespace(str) {
  return /\s/.test(str);
}

function invalidUsername(username) {
  if (username.length < 7) {
    return 'Username should be of atleast 7 characters';
  }
  if (username[0] >= '0' && username[0] <= '9') {
    return 'Username cannot start with a digit';
  }
  if (containsWhitespace(username)) {
    return 'Username cannot contain whitespace';
  }
  return null;
}

async function editAccount(userId, { name, username, description }) {
  let foundAccount = await Account.findById(userId);
  if (!foundAccount) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Account not found for id: ${userId}`,
    });
  }
  if (username && username !== foundAccount.username) {
    const userNameAvailable = await usernameExists({ username });
    if (!userNameAvailable) {
      return ErrorHandler.throwError({
        code: 400,
        message: 'Username already taken',
      });
    }
    const isInvalidUsername = invalidUsername(username);
    if (isInvalidUsername) {
      return ErrorHandler.throwError({
        code: 400,
        message: isInvalidUsername,
      });
    }
  }
  foundAccount.name = name || foundAccount.name;
  foundAccount.username = username || foundAccount.username;
  foundAccount.description = description || foundAccount.description;
  await foundAccount.save();
  return foundAccount.safeObject();
}

module.exports = editAccount;
