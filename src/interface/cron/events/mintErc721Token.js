const config = require('../../../../config');
const agenda = require('../index');
const jobs = require('../jobs');
const { Audience } = require('../../../infra/database/models');
const Deployer = require('../../../infra/utils/deployer');

const instance = new Deployer({
  chain: config.DEPLOYER_TOKEN_CHAIN,
  type: config.DEPLOYER_TOKEN_TYPE,
});

agenda.define(jobs.MINT_ERC721_TOKEN, async (job, done) => {
  const { audienceUuid } = job.attrs.data;
  try {
    await run({ audienceUuid });
    done();
  } catch (err) {
    console.error(
      'Error performing job from collection',
      jobs.MINT_ERC721_TOKEN,
      audienceUuid,
      err,
    );
    done(err);
  }
});

async function run({ audienceUuid }) {
  const audience = await Audience.findOne({ uuid: audienceUuid });
  if (audience.token && !audience.token.contractAddress) {
    return;
  }
  const newMembers = audience.members.filter((elem) => !elem.airdropped);
  const currentBatch = newMembers.slice(0, 15);
  const aidropTxHash = await instance.mint({
    addressList: currentBatch.map((elem) => elem.address),
    contractAddress: audience.token.contractAddress,
  });
  if (!aidropTxHash) {
    throw new Error('There is some issue with airdrop script!');
  }
  const updatedMembers = audience.members.map((elem) => {
    const foundElem = currentBatch.find(
      (currentBatchElem) =>
        currentBatchElem._id.toString() === elem._id.toString(),
    );
    if (foundElem) {
      elem.airdropped = true;
      elem.aidropTxHash = aidropTxHash;
    }
    return elem;
  });
  audience.members = updatedMembers;
  await audience.save();
  return currentBatch;
}
