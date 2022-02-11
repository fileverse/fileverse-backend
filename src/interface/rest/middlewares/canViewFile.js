const ErrorHandler = require('../../../infra/utils/errorHandler');
const { File } = require('../../../domain');

async function canViewFile(req, res, next) {
  const { uuid, chain = 'eth' } = req.params;
  const { userId, address } = req;
  const permission = await File.permission({ uuid, userId, address, chain });
  if (permission.read) {
    next();
  } else {
    let statusCode = 403;
    if (!userId) {
      statusCode = 401;
    }
    return ErrorHandler.throwError({
      code: statusCode,
      message: `You do not have permission to view this file: ${uuid}`,
      req,
    });
  }
}

module.exports = canViewFile;
