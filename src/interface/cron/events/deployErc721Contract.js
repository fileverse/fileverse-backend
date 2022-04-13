const config = require('../../../../config');
const agenda = require('../index');
const jobs = require('../jobs');
const Deployer = require('../../../infra/utils/deployer');

const instance = new Deployer({
  chain: config.DEPLOYER_TOKEN_CHAIN,
  type: config.DEPLOYER_TOKEN_TYPE,
});

agenda.define(jobs.DEPLOY_ERC721_CONTRACT, async (job, done) => {
  const { owner, name, symbol } = job.attrs.data;
  try {
    await run({ owner, name, symbol });
    await job.remove();
    done();
  } catch (err) {
    console.error(
      'Error removing job from collection',
      jobs.DEPLOY_ERC721_CONTRACT,
      owner,
      name,
      symbol,
      err,
    );
    done(err);
  }
});

async function run({ owner, name, symbol }) {
  const contract = await instance.deployContractInstance({
    owner,
    name,
    symbol,
  });
  return contract;
}
