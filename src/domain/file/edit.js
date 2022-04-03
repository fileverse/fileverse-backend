const ErrorHandler = require('../../infra/utils/errorHandler');
const upload = require('./upload');
const { File } = require('../../infra/database/models');
const config = require('../../../config');

async function edit(uuid, { name, file, token, slug, description }) {
  const foundFile = await File.findOne({ uuid });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'You do not own this token!',
    });
  }

  if (slug) {
    // check for uniqueness of slug with other files. If it is unique then update it else throw error.
    const fileWithSameSlug = await File.findOne({
      $and: [{ slug }, { _id: { $ne: foundFile._id } }],
    });
    if (fileWithSameSlug) {
      return ErrorHandler.throwError({
        code: 403,
        message: 'File with same slug already exists',
      });
    }
    foundFile.slug = slug;
  }

  if (token) {
    token.chain = config.CHAIN;
    foundFile.token = token;
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
  if (description) {
    foundFile.description = description;
  }
  await foundFile.save();
  return foundFile.safeObject();
}

module.exports = edit;
