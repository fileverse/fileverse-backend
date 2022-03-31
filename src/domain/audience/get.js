const { Audience } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function get(uuid) {
  const audience = await Audience.findOne({ uuid });
  if (!audience) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cound not find the audience by this uuid',
    });
  }
  return audience.safeObject();
}

module.exports = get;
