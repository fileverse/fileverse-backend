const config = require('../../../../config');
const agenda = require('../index');
const jobs = require('../jobs');
const Deployer = require('../../../infra/utils/deployer');
const instance = new Deployer({
  chain: config.DEPLOYER_TOKEN_CHAIN,
  type: config.DEPLOYER_TOKEN_TYPE,
});

agenda.define(jobs.MINT_ERC721_TOKEN, async (job, done) => {
  const { contractAddress, addressList } = job.attrs.data;
  try {
    await run({ contractAddress, addressList });
    await job.remove();
    done();
  } catch (err) {
    console.error(
      'Error removing job from collection',
      jobs.MINT_ERC721_TOKEN,
      addressList,
      contractAddress,
      err,
    );
    done(err);
  }
});

async function run({ addressList, contractAddress }) {
  const contract = await instance.mint({
    addressList,
    contractAddress,
  });
  return contract;
}
