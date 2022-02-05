const { Readable } = require('stream');
const config = require('../../../config');
const Pinata = require('../../infra/utils/pinata');
const S3 = require('../../infra/utils/s3');
const pinata = new Pinata(config.PINATA_API_KEY, config.PINATA_SECRET_KEY);
const s3 = new S3();

async function upload(file) {
  const { name, mimetype, data } = file;
  const stream = Readable.from(data);
  stream.path = name;
  const pinataFile = await pinata.pinFileToIPFS(stream, {
    name,
  });
  const s3File = await s3.upload(data, {
    name: pinataFile.ipfsHash,
    mimetype,
  });
  return {
    url: pinataFile && pinataFile.fileLink,
    s3Url: s3File && s3File.fileLink,
    mimetype,
  };
}

module.exports = upload;
