const { File, Audience } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const S3Service = require('./../../infra/utils/s3');
const IPFS = require('../../infra/utils/ipfs');
const s3 = new S3Service();
const ipfs = new IPFS();

async function remove(uuid) {
  const foundFile = await File.findOne({ uuid });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Could not find file with uuid ${uuid}`,
    });
  }
  await s3.remove({ s3Key: foundFile.s3Key });
  await ipfs.remove({
    ipfsHash: foundFile.ipfsHash,
    ipfsStorage: foundFile.ipfsStorage,
  });
  await Audience.updateMany({ fileUuid: uuid }, { $unset: { fileUuid: '' } });
  await File.deleteOne({ uuid });
  return 'ok';
}

module.exports = remove;
