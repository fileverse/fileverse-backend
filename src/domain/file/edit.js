const ErrorHandler = require('../../infra/utils/errorHandler');
const upload = require('./upload');
const { File } = require('../../infra/database/models');

async function edit(uuid, { name, file }) {
  const foundFile = await File.findOne({ uuid });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  if (file) {
    const oldVersion = {
      url: foundFile.url,
      mimetype: foundFile.mimetype,
      version: foundFile.currentVersion,
    };
    const { url, mimetype } = await upload(file);
    foundFile.url = url;
    foundFile.mimetype = mimetype;
    foundFile.currentVersion = foundFile.currentVersion + 1;
    foundFile.version.push(oldVersion);
  }
  if (name) {
    foundFile.name = name;
  }
  await foundFile.save();
  return foundFile.safeObject();
}

module.exports = edit;
