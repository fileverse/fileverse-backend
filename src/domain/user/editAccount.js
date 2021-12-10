const ErrorHandler = require('../../infra/utils/errorHandler');
const { Account } = require('../../infra/database/models');

async function editAccount(userId, { name, username, email }) {
  let foundAccount = await Account.findOneById(userId);
  if (!foundAccount) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Account not found for id: ${userId}`,
    });
  }
  foundAccount.name = name;
  foundAccount.username = username;
  foundAccount.email = email;
  return foundAccount.safeObject();
}

module.exports = editAccount;
