const { Org } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');

const deployOrgContract = () => {};

async function create({ subdomain, name, description }) {
  const orgFound = await Org.findOne({ subdomain });
  if (orgFound) {
    return ErrorHandler.throwError({
      code: 400,
      message: 'Org with this subdomain alread exists!',
    });
  }
  const logo = '';
  const cover = '';
  const { deployTxHash, deployTxLink, deployTxStatus } =
    await deployOrgContract({ subdomain, name });
  const createdOrg = await new Org({
    subdomain,
    name,
    description,
    logo,
    cover,
    deployTxHash,
    deployTxLink,
    deployTxStatus,
  }).save();
  return createdOrg;
}

module.exports = create;
