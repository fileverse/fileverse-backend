const ErrorHandler = require('../../../infra/utils/errorHandler');
const { Comment } = require('../../../domain');

async function canEditComment(req, res, next) {
  const { uuid, shortId } = req.params;
  const { userId } = req;
  const permission = await Comment.permission({ uuid, userId, shortId });
  if (permission.edit) {
    next();
  } else {
    let statusCode = 403;
    if (!userId) {
      statusCode = 401;
    }
    return ErrorHandler.throwError({
      code: statusCode,
      message: `You do not have permission to edit this comment: ${shortId}`,
      req,
    });
  }
}

module.exports = canEditComment;
