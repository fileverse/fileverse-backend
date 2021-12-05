const config = require('../../../config');
const Pinata = require('../../infra/utils/pinata');
const pinata = new Pinata(config.PINATA_API_KEY, config.PINATA_SECRET_KEY);

async function upload(file) {
  const { name, mimetype, data } = file;
  const pinataFile = await pinata.pinFileToIPFS(data, {
    name,
  });
  return { url: pinataFile.fileLink, mimetype };
}

module.exports = upload;
