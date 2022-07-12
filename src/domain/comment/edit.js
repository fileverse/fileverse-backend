const { File, Comment } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const getChatKey = require('./getChatKey');
const upload = require('./upload');
const { encryptString } = require('../../infra/utils/stream');

async function edit({ shortId, text, userId, fileUuid }) {
  // get file
  const file = await File.findOne({ uuid: fileUuid });
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  // get chat encryption key of file
  const chatKey = await getChatKey(file.uuid);
  // encrypt chat content using the above key
  const encryptedText = await encryptString(text, chatKey);
  // store the chat content to ipfs and database
  const { ipfsUrl, ipfsHash, ipfsStorage, mimetype } = await upload(
    encryptedText,
  );

  // store the chat content to ipfs and database
  const comment = await Comment.findOneAndUpdate(
    { shortId, userId, fileUuid },
    {
      $set: {
        ipfsUrl,
        ipfsHash,
        ipfsStorage,
        mimetype,
        text: encryptedText,
        encrypted: true,
      },
    },
    { new: true },
  );
  if (!comment) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the comemnt by this shortId and fileUuid',
    });
  } else {
    return comment.safeObject();
  }
}

module.exports = edit;
