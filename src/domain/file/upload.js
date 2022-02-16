const { Readable } = require('stream');
const config = require('../../../config');
const { encryptStream } = require('../../infra/utils/stream');
const Pinata = require('../../infra/utils/pinata');
const S3 = require('../../infra/utils/s3');
const ReadableStreamClone = require('readable-stream-clone');
const pinata = new Pinata(config.PINATA_API_KEY, config.PINATA_SECRET_KEY);
const s3 = new S3();

async function upload(file) {
  try {
    const { name, mimetype, data } = file;
    const stream = Readable.from(data);
    const encryptedStream = Readable.from(encryptStream(stream));
    encryptedStream.path = name;
    const encryptedStreamClone = new ReadableStreamClone(encryptedStream);
    const pinataFile = await pinata.pinFileToIPFS(encryptedStream, {
      name,
    });
    const s3File = await s3.uploadFromStream(
      encryptedStreamClone,
      pinataFile.ipfsHash,
      mimetype,
    );
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
