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
  const { name, symbol, image, description, audienceUuid } = job.attrs.data;
  try {
    await run({ name, symbol, audienceUuid, description, image });
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
      description,
      err,
    );
    done(err);
  }
});

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

async function run({ audienceUuid, name, symbol, image, description }) {
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
    name: name || symbol,
    symbol,
    image,
    description,
    gateBalance: 1,
    tokenType: config.DEPLOYER_TOKEN_TYPE,
    chain: config.DEPLOYER_TOKEN_CHAIN,
    creationTxHash: contract.deployTransaction.hash,
    explorerLink: getExplorerLink(
      contract.address,
      config.DEPLOYER_TOKEN_CHAIN,
    ),
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
