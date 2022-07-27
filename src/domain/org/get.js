const { Org } = require('../../infra/database/models');

async function get(subdomain) {
  if (!subdomain) return null;
  const org = await Org.findOne({ subdomain });
  return org;
}

module.exports = get;
