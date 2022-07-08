const { Analytics, File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function create(eventName, fileUuid) {
  const file = await File.findOne({ uuid: fileUuid });

  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  const analytics = await new Analytics({ eventName, fileUuid }).save();
  return analytics.safeObject();
}

module.exports = create;
