const short = require('short-uuid');
const { Comment, File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const getChatKey = require('./getChatKey');
const upload = require('./upload');
const { decryptString, encryptString } = require('../../infra/utils/stream');

async function processComment(comment, chatKey) {
  const safeComment = comment.safeObject();
  if (safeComment.encrypted) {
    // decrypt chat content using the above key
    safeComment.text = await decryptString(safeComment.text, chatKey);
  }
  // return the chat content
  return safeComment;
}

async function create({ userId, fileUuid, text, address }) {
  const shortId = short.generate();

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
  const encryptedTextBuffer = await encryptString(text, chatKey);
  const encryptedText = encryptedTextBuffer.toString();
  // store the chat content to ipfs and database
  const { ipfsUrl, ipfsHash, ipfsStorage, mimetype } = await upload({
    userId,
    fileUuid,
    text: encryptedText,
    address,
  });

  const comment = await new Comment({
    shortId,
    userId,
    fileId: file._id,
    text: encryptedText,
    ipfsUrl,
    ipfsHash,
    ipfsStorage,
    mimetype,
    encrypted: true,
    fileUuid: file.uuid,
    by: address,
  }).save();
  return processComment(comment, chatKey);
}

module.exports = create;
