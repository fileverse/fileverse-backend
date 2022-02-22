const ErrorHandler = require('../../infra/utils/errorHandler');
const { File } = require('../../infra/database/models');

async function get(uuid) {
  console.log({ uuid });
  const foundFile = await File.findOne({ $or: [{ uuid }, { slug: uuid }] });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  return foundFile.safeObject();
}

module.exports = get;
