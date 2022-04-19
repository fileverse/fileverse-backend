const config = require('../../../../config');
const agenda = require('../index');
const jobs = require('../jobs');
const Deployer = require('../../../infra/utils/deployer');
const { File } = require('../../../domain');
const { Audience } = require('../../../infra/database/models');

const instance = new Deployer({
  chain: config.DEPLOYER_TOKEN_CHAIN,
  type: config.DEPLOYER_TOKEN_TYPE,
});

agenda.define(jobs.DEPLOY_ERC721_CONTRACT, async (job, done) => {
  const { name, symbol, image, audienceUuid } = job.attrs.data;
  try {
    await run({ name, symbol, audienceUuid, image });
    await postRun({ audienceUuid });
    done();
  } catch (err) {
    console.error(
      'Error removing job from collection',
      jobs.DEPLOY_ERC721_CONTRACT,
      audienceUuid,
      name,
      symbol,
      image,
      err,
    );
    done(err);
  }
});

async function run({ audienceUuid, name, symbol, image }) {
  const audience = await Audience.findOne({ uuid: audienceUuid });
  if (audience.token && audience.token.contractAddress) {
    return;
  }
  const contract = await instance.deployContractInstance({
    ownerAddress: audience.ownerAddress,
    name,
    symbol,
    baseUri: `https://api.fileverse.io/tokens/${audience.uuid}/`,
  });
  audience.token = {
    contractAddress: contract.address,
    name: symbol,
    image,
    gateBalance: 1,
    tokenType: config.DEPLOYER_TOKEN_TYPE,
    chain: config.DEPLOYER_TOKEN_CHAIN,
    creationTxHash: contract.deployTransaction.hash,
    createdOnFileverse: true,
    managedOnFileverse: true,
  };
  await audience.save();
  return audience.uuid;
}

async function postRun({ audienceUuid }) {
  const audience = await Audience.findOne({ uuid: audienceUuid }).lean();
  const permission = await File.permission({
    uuid: audience.fileUuid,
    userId: audience.owner,
    address: audience.ownerAddress,
  });
  const token = audience.token;
  token.audienceUuid = audience.uuid;
  if (permission.edit) {
    await File.edit(audience.fileUuid, { token });
  }
  agenda.now(jobs.MINT_ERC721_TOKEN, {
    audienceUuid: audience.uuid,
  });
  return audience;
}
