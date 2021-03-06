const ErrorHandler = require('../../../infra/utils/errorHandler');
const { Comment } = require('../../../domain');

async function canViewComment(req, res, next) {
  const uuid = req.query.uuid;
  const { userId } = req;
  const { shortId } = req.params;
  const permission = await Comment.permission({ uuid, userId, shortId });
  if (permission.read) {
    next();
  } else {
    let statusCode = 403;
    if (!userId) {
      statusCode = 401;
    }
    return ErrorHandler.throwError({
      code: statusCode,
      message: `You do not have permission to view this comment: ${shortId}`,
      req,
    });
  }
}

module.exports = canViewComment;
