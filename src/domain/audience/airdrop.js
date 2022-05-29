const jobs = require('../../interface/cron/jobs');
const cron = require('../../interface/cron');
const create = require('./create');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function airdrop({
  name,
  symbol,
  inputType,
  owner,
  ownerAddress,
  csv,
  addressList,
  fileUuid,
}) {
  const audience = await create({
    inputType,
    owner,
    ownerAddress,
    csv,
    addressList,
    fileUuid,
  });
  
  cron.now(jobs.DEPLOY_ERC721_CONTRACT, {
    audienceUuid: audience.uuid,
    name,
    symbol,
  });
  audience.airdropInProgress = true;

  await audience.save();
  return audience.safeObject();
}

module.exports = airdrop;
