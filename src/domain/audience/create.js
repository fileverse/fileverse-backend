const ErrorHandler = require('../../infra/utils/errorHandler');
const { Readable } = require('stream');
const csv = require('csv-parser');
const { Audience } = require('../../infra/database/models');

async function getMembersFromCSV(data) {
  return new Promise((resolve, reject) => {
    const stream = Readable.from(data);
    let result = [];
    stream
      .pipe(csv())
      .on('data', (row) => {
        console.log(row);
        result.push({
          ensName: row.ensName,
          address: row.address,
        });
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

async function create(owner, file) {
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'CSV file not found',
    });
  }

  const members = await getMembersFromCSV(file.data);
  console.log(members);
  const createdAudience = await new Audience({ owner, members }).save();
  return createdAudience;
}

module.exports = create;
