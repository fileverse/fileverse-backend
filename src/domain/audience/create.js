const ErrorHandler = require('../../infra/utils/errorHandler');
const { Readable } = require('stream');
const csv = require('csv-parser');
const { Audience } = require('../../infra/database/models');
const { utils, getDefaultProvider } = require('ethers');
const config = require('./../../../config');

const provider = getDefaultProvider('homestead', {
  etherscan: config.ETHERSCAN_API_KEY,
});

async function getMembersFromCSV(data) {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(data);
    let result = [];
    stream
      .pipe(csv())
      .on('data', async (row) => {
        const address = row.address;
        if (utils.isAddress(address)) {
          result.push({
            ensName: '',
            address: address,
          });
        } else if (address.includes('.eth')) {
          result.push({
            address: '',
            ensName: address,
          });
        } else {
          result.push({
            ensName: '',
            address: '',
          });
        }
      })
      .on('end', () => {
        resolve(result);
        console.log('CSV file successfully processed');
      })
      .on('error', () => {
        reject([]);
      });
  });
}

async function getAddressFromEnsName(members) {
  console.log(typeof members);
  for (let i = 0; i < members.length; ++i) {
    if (members[i].ensName)
      members[i].address = await provider.resolveName(members[i].ensName);
  }

  return members;
}

async function create(owner, file) {
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'CSV file not found',
    });
  }

  let members = await getMembersFromCSV(file.data);
  members = await getAddressFromEnsName(members);
  const createdAudience = new Audience({ owner, members });
  return createdAudience;
}

module.exports = create;
