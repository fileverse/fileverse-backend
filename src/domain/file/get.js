const ErrorHandler = require('../../infra/utils/errorHandler');
const { File, Account } = require('../../infra/database/models');

async function get(uuid, safe = true) {
  let foundFile = await File.findOne({
    $or: [{ uuid }, { slug: uuid }],
    isDeleted: { $ne: true },
  });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }

  let owner = null;

  if (foundFile.owner) {
    owner = await Account.findOne(
      { _id: foundFile.owner },
      { __v: 0, createdAt: 0, _id: 0 },
    );
  }

  if (safe) {
    return { ...foundFile.safeObject(), owner };
  }
  return { ...foundFile.toObject(), owner };
}

module.exports = get;
