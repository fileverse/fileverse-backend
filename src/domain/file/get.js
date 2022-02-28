const ErrorHandler = require('../../infra/utils/errorHandler');
const { File } = require('../../infra/database/models');
const config = require('./../../../config');
async function get(uuid, viewer) {
  const expiryDuration = parseInt(
    viewer
      ? config.FILE_EXPIRY_SECONDS_AUTHENTICATED
      : config.FILE_EXPIRY_SECONDS_UNAUTHENTICATED,
    10,
  );

  const allowedCreatedDate = new Date() - expiryDuration;

  const foundFile = await File.findOne({
    createdAt: { $lte: allowedCreatedDate },
    $or: [{ uuid }, { slug: uuid }],
  });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }

  return {
    ...foundFile.safeObject(),
    expiresIn: foundFile.createdAt + expiryDuration,
  };
}

module.exports = get;
