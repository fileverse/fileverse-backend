const ErrorHandler = require('../../infra/utils/errorHandler');
const upload = require('./upload');
const { File } = require('../../infra/database/models');
const config = require('../../../config');
const mime = require('mime-types');

function getExplorerLink(contractAddress, chain) {
  if (chain === 'gnosis') {
    return `https://blockscout.com/xdai/mainnet/address/${contractAddress}/transactions`;
  } else if (chain === 'rinkeby') {
    return `https://rinkeby.etherscan.io/address/${contractAddress}`;
  } else if (chain === 'polygon') {
    return `https://polygonscan.com/address/${contractAddress}`;
  } else if (chain === 'ethereum') {
    return `https://etherscan.io/address/${contractAddress}`;
  }
  return '';
}

async function edit(
  uuid,
  { name, file, token, slug, description, downloadable },
) {
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
    token.chain = token.chain || config.CHAIN;
    token.explorerLink = getExplorerLink(token.contractAddress, token.chain);
    foundFile.token = token;
  }
  if (file) {
    let extension = file.name.split('.').pop();
    if (file.mimetype.includes('image')) {
      extension = mime.extension(file.mimetype);
    }
    const oldVersion = {
      s3Url: foundFile.s3Url,
      s3Key: foundFile.s3Key,
      ipfsHash: foundFile.ipfsHash,
      ipfsUrl: foundFile.ipfsUrl,
      ipfsStorage: foundFile.ipfsStorage,
      mimetype: foundFile.mimetype,
      encryptedDataKey: foundFile.encryptedDataKey,
      version: foundFile.currentVersion,
    };
    const {
      s3Url,
      s3Key,
      ipfsHash,
      ipfsUrl,
      ipfsStorage,
      mimetype,
      encryptedDataKey,
    } = await upload(file);
    foundFile.s3Url = s3Url;
    foundFile.s3Key = s3Key;
    foundFile.ipfsHash = ipfsHash;
    foundFile.ipfsUrl = ipfsUrl;
    foundFile.ipfsStorage = ipfsStorage;
    foundFile.mimetype = mimetype;
    foundFile.extension = extension;
    foundFile.encryptedDataKey = encryptedDataKey;
    foundFile.currentVersion = foundFile.currentVersion + 1;
    foundFile.version.push(oldVersion);
  }
  if (name) {
    foundFile.name = name;
  }
  if (description) {
    foundFile.description = description;
  }
  if (downloadable !== undefined) {
    foundFile.settings.downloadable = downloadable === 'true';
  }
  await foundFile.save();
  return foundFile.safeObject();
}

module.exports = edit;
