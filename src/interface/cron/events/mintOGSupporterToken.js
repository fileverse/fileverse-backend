const agenda = require('../index');
const jobs = require('../jobs');
const { Audience } = require('../../../infra/database/models');

const OG_SUPPORTER_AUDIENCE = '';

agenda.define(jobs.MINT_OG_SPPORTER_TOKEN, async (job, done) => {
  const { address } = job.attrs.data;
  try {
    await run({ address });
    done();
  } catch (err) {
    console.error(
      'Error performing job from collection',
      jobs.MINT_OG_SPPORTER_TOKEN,
      address,
      err,
    );
    done(err);
  }
});

async function run({ address }) {
  const audience = await Audience.findOne({ uuid: OG_SUPPORTER_AUDIENCE });
  if (audience.token && !audience.token.contractAddress) {
    return;
  }
  audience.members.push({ address, ensName: '' });
  await audience.save();
  agenda.now(jobs.MINT_ERC721_TOKEN, {
    audienceUuid: audience.uuid,
  });
  return audience;
}
