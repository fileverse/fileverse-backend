const config = require('../../../../config');
const agenda = require('../index');
const jobs = require('../jobs');
const Deployer = require('../../../infra/utils/deployer');
const instance = new Deployer({
  chain: config.DEPLOYER_TOKEN_CHAIN,
  type: config.DEPLOYER_TOKEN_TYPE,
});

agenda.define(jobs.TRANSFER_ERC721_CONTRACT, async (job, done) => {
  const { owner, contractAddress } = job.attrs.data;
  try {
    await run({ owner, contractAddress });
    done();
  } catch (err) {
    console.error(
      'Error removing job from collection',
      jobs.TRANSFER_ERC721_CONTRACT,
      owner,
      contractAddress,
      err,
    );
    done(err);
  }
});

async function run({ owner, contractAddress }) {
  const contract = await instance.transferOwnership({
    contractAddress,
    address: owner,
  });
  return contract;
}
