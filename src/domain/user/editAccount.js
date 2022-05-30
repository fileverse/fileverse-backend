const ErrorHandler = require('../../infra/utils/errorHandler');
const { Account } = require('../../infra/database/models');
const usernameExists = require('./usernameExists');

async function editAccount(userId, { name, username, description }) {
  let foundAccount = await Account.findById(userId);
  if (!foundAccount) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Account not found for id: ${userId}`,
    });
  }
  if (username) {
    await usernameExists({ username });
  }
  foundAccount.name = name || foundAccount.name;
  foundAccount.username = username || foundAccount.username;
  foundAccount.description = description || foundAccount.description;
  await foundAccount.save();
  return foundAccount.safeObject();
}

module.exports = editAccount;
