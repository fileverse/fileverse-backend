const { v4: uuidv4 } = require('uuid');
const upload = require('./upload');
const { File } = require('../../infra/database/models');

async function create({ name, file, owner }) {
  const { url, s3Url, mimetype } = await upload(file);
  const uuid = uuidv4();
  const savedFile = await new File({
    uuid,
    name,
    url,
    s3Url,
    mimetype,
    owner,
    version: [],
  }).save();
  return savedFile.safeObject();
}

module.exports = create;
