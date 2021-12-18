const ErrorHandler = require('../../../infra/utils/errorHandler');
const { User } = require('../../../domain');

async function canEditAccount(req, res, next) {
  const { address } = req.params;
  const { userId } = req;
  const permission = await User.permission({ address, userId });
  if (permission.edit) {
    next();
  } else {
    let statusCode = 403;
    if (!userId) {
      statusCode = 401;
    }
    return ErrorHandler.throwError({
      code: statusCode,
      message: `You do not have permission to edit this account: ${address}`,
      req,
    });
  }
}

module.exports = canEditAccount;
