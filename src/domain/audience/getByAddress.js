const { Audience } = require('../../infra/database/models');

async function getByAddress(address) {
  const foundAudiences = await Audience.find(
    {
      members: { $elemMatch: { address: address, airdropped: true } },
    },
    { fileUuid: 1, uuid: 1, _id: 1, token: 1, owner: 1 },
  );
  return foundAudiences.map((aud) => aud.safeObject());
}

module.exports = getByAddress;
