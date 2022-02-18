const ErrorHandler = require('../../infra/utils/errorHandler');
const { Account } = require('../../infra/database/models');

async function editAccount(userId, { name, username, email, description }) {
  let foundAccount = await Account.findById(userId);
  if (!foundAccount) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Account not found for id: ${userId}`,
    });
  }
  foundAccount.name = name;
  foundAccount.username = username;
  foundAccount.email = email;
  foundAccount.description = description;
  await foundAccount.save();
  return foundAccount.safeObject();
}

module.exports = editAccount;
