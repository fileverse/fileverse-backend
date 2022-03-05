const ErrorHandler = require('../../infra/utils/errorHandler');
const { File } = require('../../infra/database/models');

async function get(uuid, safe = true) {
  const foundFile = await File.findOne({ $or: [{ uuid }, { slug: uuid }] });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  if (safe) {
    return foundFile.safeObject();
  }
  return foundFile.toObject();
}

module.exports = get;
