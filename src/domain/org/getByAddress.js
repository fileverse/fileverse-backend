const { Org } = require('../../infra/database/models');

async function getByAddress(address) {
  if (!address) return null;
  const org = await Org.findOne({ address });
  return org;
}

module.exports = getByAddress;
