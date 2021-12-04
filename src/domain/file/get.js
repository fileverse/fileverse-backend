const { File } = require('../../infra/database/models');

async function get(uuid) {
  const foundFile = await File.findOne({
    uuid,
  });
  if (!foundFile) {
    throw new Error('Cannot find the file by this uuid');
  }
  return foundFile.safeObject();
}

module.exports = get;
