const jobs = require('../../interface/cron/jobs');
const cron = require('../../interface/cron');
const create = require('./create');
const { Audience } = require('../../infra/database/models');

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
  const { uuid } = await create({
    inputType,
    owner,
    ownerAddress,
    csv,
    addressList,
    fileUuid,
  });
  const audience = await Audience.findOne({ uuid });
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
