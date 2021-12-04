const { v4: uuidv4 } = require('uuid');
const upload = require('./upload');
const { File } = require('../../infra/database/models');

async function create({ file, owner }) {
  const { url, mimetype } = await upload(file);
  const uuid = uuidv4();
  const savedFile = await new File({
    uuid,
    url,
    mimetype,
    owner,
    version: [],
  }).save();
  return savedFile.safeObject();
}

module.exports = create;
