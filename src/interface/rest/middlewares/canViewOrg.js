const ErrorHandler = require('../../../infra/utils/errorHandler');

async function canViewOrg(req, res, next) {
  const { address } = req.params;
  const permission = { edit: true, view: true };
  if (permission.view) {
    next();
  } else {
    let statusCode = 403;
    if (!address) {
      statusCode = 401;
    }
    return ErrorHandler.throwError({
      code: statusCode,
      message: `You do not have permission to view this org: ${address}`,
      req,
    });
  }
}

module.exports = canViewOrg;
