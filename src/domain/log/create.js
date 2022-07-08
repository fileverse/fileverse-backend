const { Log, File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function create(eventName, fileUuid) {
  const file = await File.findOne({ uuid: fileUuid });

  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  const logs = await new Log({ eventName, fileUuid }).save();
  return logs.safeObject();
}

module.exports = create;
