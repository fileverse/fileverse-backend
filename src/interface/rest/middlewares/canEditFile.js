const ErrorHandler = require('../../../infra/utils/errorHandler');
const { File } = require('../../../domain');

async function canEditFile(req, res, next) {
  const { uuid } = req.params;
  const { userId, address } = req;
  const permission = await File.permission({ uuid, userId, address });
  if (permission.edit) {
    next();
  } else {
    let statusCode = 403;
    if (!userId) {
      statusCode = 401;
    }
    return ErrorHandler.throwError({
      code: statusCode,
      message: `You do not have permission to edit this file: ${uuid}`,
      req,
    });
  }
}

module.exports = canEditFile;
