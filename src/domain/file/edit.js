const ErrorHandler = require('../../infra/utils/errorHandler');
const upload = require('./upload');
const { File } = require('../../infra/database/models');
const MoralisService = require('../../infra/utils/moralis');

const moralisService = new MoralisService();

async function edit(uuid, { name, file, token, address }) {
  const foundFile = await File.findOne({ uuid });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
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
  if (token) {
    foundFile.token = token;
  }
  await foundFile.save();
  return foundFile.safeObject();
}

module.exports = edit;
