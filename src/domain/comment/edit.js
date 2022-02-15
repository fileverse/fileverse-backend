const { Comment } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function edit({ shortId, text, userId }) {
  const comment = await Comment.findOneAndUpdate(
    { shortId, userId },
    { $set: { text: text } },
    { new: true },
  );
  if (!comment) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the comemnt by this shortId and userId',
    });
  } else {
    return comment.safeObject();
  }
}

module.exports = edit;
