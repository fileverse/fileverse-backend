const S3 = require('./../../infra/utils/s3');
const md5 = require('md5');
const { Account } = require('../../infra/database/models');
const s3 = new S3();

async function addAvatar({ userId, address, image }) {
  const { mimetype, data } = image;
  const hash = md5(address);
  const { fileLink } = await s3.upload(data, {
    name: hash,
    mimetype,
  });
  await Account.updateOne(
    { userId },
    {
      $set: {
        image: fileLink,
      },
    },
  );
  return { image: fileLink };
}

module.exports = addAvatar;
