const jobs = require('../../interface/cron/jobs');
const cron = require('../../interface/cron');
const create = require('./create');
const { Audience } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const S3 = require('../../infra/utils/s3');

const s3 = new S3();

async function airdrop({
  name,
  symbol,
  inputType,
  owner,
  ownerAddress,
  csv,
  addressList,
  fileUuid,
  tokenImage,
}) {
  if ((!csv && !addressList) || (csv != null && addressList != null)) {
    return ErrorHandler.throwError({
      code: 400,
      message: 'Only one of CSV or addressList is needed.',
    });
  }

  if (addressList) {
    try {
      addressList = JSON.parse(addressList);
    } catch (e) {
      return ErrorHandler.throwError({
        code: 400,
        message:
          'Not a valid addressList!, expects addresslist array in string format',
      });
    }
  }

  const { uuid } = await create({
    inputType,
    owner,
    ownerAddress,
    csv,
    addressList,
    fileUuid,
  });

  const { data, mimetype } = tokenImage;
  const { s3Url } = await s3.upload(data, {
    name: uuid,
    mimetype,
  });

  const audience = await Audience.findOne({ uuid });
  cron.now(jobs.DEPLOY_ERC721_CONTRACT, {
    audienceUuid: audience.uuid,
    name,
    symbol,
    image: s3Url,
  });
  audience.airdropInProgress = true;
  await audience.save();
  return audience.safeObject();
}

module.exports = airdrop;
