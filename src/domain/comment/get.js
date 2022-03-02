const { File, Comment } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function get(fileUuid) {
  const file = await File.findOne({ uuid: fileUuid });
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  const comments = await Comment.find({ fileId: file._id });
  comments.map((comment) => comment.safeObject());
  return comments;
}

module.exports = get;
