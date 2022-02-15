const { Comment } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function remove(shortId, userId) {
  const comment = await Comment.findOneAndDelete({ shortId, userId });
  if (!comment) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the comemnt by this shortId and userId',
    });
  } else {
    return true;
  }
}

module.exports = remove;
