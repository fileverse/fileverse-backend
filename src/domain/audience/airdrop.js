const jobs = require('../../interface/cron/jobs');
const cron = require('../../interface/cron');
const { Audience } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

async function airdrop({ uuid, name, symbol }) {
  const audience = await Audience.findOne({ uuid });
  if (!audience) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cound not find the audience by this uuid',
    });
  }
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
