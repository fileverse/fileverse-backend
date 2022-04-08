const { File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const S3Service = require('./../../infra/utils/s3');
const Pinata = require('../../infra/utils/pinata');
const s3 = new S3Service();
const pinata = new Pinata();

async function remove(uuid) {
  const foundFile = await File.findOne({ uuid });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Could not find file with uuid ${uuid}`,
    });
  }
  await s3.remove({ s3Key: foundFile.s3Key });
  await pinata.unPinFile(foundFile.ipfsHash);
  await File.deleteOne({ uuid });
  return 'ok';
}

module.exports = remove;
