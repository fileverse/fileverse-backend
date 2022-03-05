const config = require('../../../config');
const { v4: uuidv4 } = require('uuid');
const upload = require('./upload');
const { File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function create({ name, file, owner, slug, description }) {
  const uuid = uuidv4();
  // file's slug should not be equal to slug or uuid of any other file
  // give default slug to be uuid
  if (slug) {
    const foundFile = await File.findOne({ $or: [{ slug }, { uuid: slug }] });
    if (foundFile) {
      return ErrorHandler.throwError({
        code: 403,
        message: 'File with same slug already exists',
      });
    }
  } else {
    slug = uuid;
  }
  const { s3Url, s3Key, ipfsHash, ipfsUrl, mimetype, encryptedDataKey } =
    await upload(file);
  const savedFile = await new File({
    uuid,
    name,
    url: `${config.SERVER_URL}/content/${uuid}`,
    s3Url,
    s3Key,
    ipfsHash,
    ipfsUrl,
    encryptedDataKey,
    mimetype,
    owner,
    slug,
    description,
    version: [],
  }).save();
  return savedFile.safeObject();
}

module.exports = create;
