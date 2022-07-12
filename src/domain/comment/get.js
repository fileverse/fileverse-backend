const { File, Comment } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const getChatKey = require('./getChatKey');
const { decryptString } = require('../../infra/utils/stream');

async function processComment(comment, chatKey) {
  const safeComment = comment.safeObject();
  if (safeComment.encrypted) {
    // decrypt chat content using the above key
    safeComment.text = await decryptString(safeComment.text, chatKey);
  }
  // return the chat content
  return safeComment;
}

async function get(fileUuid) {
  const file = await File.findOne({ uuid: fileUuid });
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }

  // get chat encryption key of file
  const chatKey = await getChatKey(file.uuid);
  const comments = await Comment.find({ fileId: file._id });
  const promises = comments.map((comment) => processComment(comment, chatKey));
  return Promise.all(promises);
}

module.exports = get;
