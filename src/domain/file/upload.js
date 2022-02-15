const { Readable } = require('stream');
const config = require('../../../config');
const { encryptStream } = require('../../infra/utils/stream');
const Pinata = require('../../infra/utils/pinata');
const S3 = require('../../infra/utils/s3');
const pinata = new Pinata(config.PINATA_API_KEY, config.PINATA_SECRET_KEY);
const s3 = new S3();

async function upload(file) {
  try {
    const { name, mimetype, data } = file;
    const stream = Readable.from(data);
    const stream2 = Readable.from(data);
    stream.path = name;
    stream2.path = name;
    const encryptedStream = Readable.from(encryptStream(stream));
    encryptedStream.path = name;
    const pinataFile = await pinata.pinFileToIPFS(encryptedStream, {
      name,
    });
    const encryptedStream2 = Readable.from(encryptStream(stream2));
    encryptedStream2.path = name;
    const s3File = await s3.uploadFromStream(
      encryptedStream2,
      pinataFile.ipfsHash,
      mimetype,
    );
    console.log(s3File);
    return {
      url: pinataFile && pinataFile.fileLink,
      s3Url: s3File && s3File.fileLink,
      mimetype,
    };
  } catch (err) {
    console.log(err);
  }
}

module.exports = upload;
