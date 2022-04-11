const ErrorHandler = require('../../infra/utils/errorHandler');
const { Readable } = require('stream');
const csv = require('csv-parser');
const { Audience } = require('../../infra/database/models');
const { utils, getDefaultProvider } = require('ethers');
const config = require('./../../../config');
const { v4: uuidv4 } = require('uuid');

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
        const address = row.address || '';
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
      })
      .on('error', () => {
        reject([]);
      });
  });
}

async function getAddressFromEnsName(members) {
  const allMemeberPromises = members.map(async ({ ensName, address }) => ({
    address: address ? address : await provider.resolveName(ensName),
    ensName,
  }));
  return await Promise.all(allMemeberPromises);
}

async function create(owner, file) {
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'CSV file not found',
    });
  }
  const uuid = uuidv4();
  let members = await getMembersFromCSV(file.data);
  members = await getAddressFromEnsName(members);
  const createdAudience = await new Audience({ uuid, owner, members }).save();
  return createdAudience.safeObject();
}

module.exports = create;
