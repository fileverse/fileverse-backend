const ErrorHandler = require('../../infra/utils/errorHandler');
const upload = require('./upload');
const { File } = require('../../infra/database/models');
const MoralisService = require('../../infra/utils/moralis');

const moralisService = new MoralisService();

async function edit(uuid, { name, file, token, address, slug }) {
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

  if (
    token &&
    !moralisService.verifyOwnership({
      address,
      contractAddress: token.contractAddress,
      chain: token.chain,
      tokenType: token.tokenType,
    })
  ) {
    return ErrorHandler.throwError({
      code: 403,
      message: 'You are not owner for this address',
    });
  }
  if (token) {
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
  await foundFile.save();
  return foundFile.safeObject();
}

module.exports = edit;
