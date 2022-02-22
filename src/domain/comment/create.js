const short = require('short-uuid');
const { Comment, File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function create({ userId, fileUuid, text, address }) {
  const shortId = short.generate();

  const file = await File.findOne({ uuid: fileUuid });

  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }

  const comment = await new Comment({
    shortId,
    userId,
    fileId: file._id,
    text,
    fileUuid: file.uuid,
    by: address,
  }).save();

  return comment.safeObject();
}

module.exports = create;
