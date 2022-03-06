const ErrorHandler = require('../../../infra/utils/errorHandler');
const { File, User } = require('../../../domain');

async function canViewContent(req, res, next) {
  const { sessionId } = req.query;
  const { uuid } = req.params;
  const { address, userId } = await User.getSession({ sessionId });
  const permission = await File.permission({ uuid, userId, address });
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

module.exports = canViewContent;
