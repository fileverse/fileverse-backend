const upload = require('./upload');
const { File } = require('../../infra/database/models');

async function update(uuid, { file }) {
  const foundFile = await File.findOne({ uuid });
  if (!foundFile) {
    throw new Error('Cannot find the file by this uuid');
  }
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
  await foundFile.save();
  return foundFile.safeObject();
}

module.exports = update;
