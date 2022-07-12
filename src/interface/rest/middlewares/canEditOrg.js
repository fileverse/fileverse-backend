const ErrorHandler = require('../../../infra/utils/errorHandler');

async function canEditOrg(req, res, next) {
  const { address } = req.params;
  const permission = { edit: true, view: true };
  if (permission.edit) {
    next();
  } else {
    let statusCode = 403;
    if (!address) {
      statusCode = 401;
    }
    return ErrorHandler.throwError({
      code: statusCode,
      message: `You do not have permission to edit this org: ${address}`,
      req,
    });
  }
}

module.exports = canEditOrg;
