const config = require('../../../config');
const { v4: uuidv4 } = require('uuid');
const upload = require('./upload');
const { File, Account } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function checkLimits({ owner }) {
  const allCreatedFiles = await File.find({}).count();
  if (allCreatedFiles > 10000) {
    return ErrorHandler.throwError({
      code: 429,
      message: 'You seem to have hit our limits! We are currently in beta.',
    });
  }
  if (!owner) {
    return;
  }
  const account = await Account.findOne({ _id: owner });
  const createdFiles = await File.find({ owner }).count();
  const limit = account && account.isPaid === true ? 1000 : 10;
  if (createdFiles > limit) {
    return ErrorHandler.throwError({
      code: 429,
      message: 'Currently in beta we only allow 10 files per account!',
    });
  }
  return;
}

async function create({ name, file, owner, slug, description }) {
  if (file.size > (parseInt(config.FILE_SIZE_LIMIT, 10) || 10 * 1024 * 1024)) {
    return ErrorHandler.throwError({
      code: 403,
      message: 'File size cannot exceed 10 MB.',
    });
  }
  await checkLimits({ owner });

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
  const {
    s3Url,
    s3Key,
    ipfsHash,
    ipfsUrl,
    ipfsStorage,
    mimetype,
    encryptedDataKey,
  } = await upload(file);
  const savedFile = await new File({
    uuid,
    name,
    url: `${config.SERVER_URL}/content/${uuid}`,
    s3Url,
    s3Key,
    ipfsHash,
    ipfsUrl,
    ipfsStorage,
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
