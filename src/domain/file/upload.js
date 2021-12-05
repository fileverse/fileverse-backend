const { Readable } = require('stream');
const config = require('../../../config');
const Pinata = require('../../infra/utils/pinata');
const pinata = new Pinata(config.PINATA_API_KEY, config.PINATA_SECRET_KEY);

async function upload(file) {
  const { name, mimetype, data } = file;
  const stream = Readable.from(data);
  stream.path = name;
  const pinataFile = await pinata.pinFileToIPFS(stream, {
    name,
  });
  return { url: pinataFile.fileLink, mimetype };
}

module.exports = upload;
