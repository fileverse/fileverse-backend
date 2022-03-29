const { Readable } = require('stream');
const Pinata = require('../../infra/utils/pinata');
const S3 = require('../../infra/utils/s3');
const ReadableStreamClone = require('readable-stream-clone');
const { encryptStream } = require('../../infra/utils/stream');
const KMS = require('../../infra/utils/kms');
const Web3StorageService = require('./../../infra/utils/web3storage');
const pinata = new Pinata();
const s3 = new S3();
const kms = new KMS();
const web3Storage = new Web3StorageService();

async function upload(file) {
  const { name, mimetype, data } = file;

  const dataKey = await kms.generateDataKey();
  console.log(dataKey);
  // upload to pinata
  const stream = Readable.from(data);
  const encryptedStreamPinata = Readable.from(
    encryptStream(stream, dataKey.Plaintext)
  );
  encryptedStreamPinata.path = name;

  const encryptedStreamWeb3Storage = new ReadableStreamClone(
    encryptedStreamPinata
  );
  encryptedStreamWeb3Storage.path = name;
  console.log(file);
  const files = await web3Storage.upload(file);
  console.log({ files });
  return;

  const encryptedStreamS3 = new ReadableStreamClone(encryptedStreamPinata);
  encryptedStreamS3.path = name;
  const pinataFile = await pinata.upload(encryptedStreamPinata, {
    name,
    mimetype,
  });
  // upload to s3
  const s3File = await s3.upload(encryptedStreamS3, {
    name: pinataFile.ipfsHash,
    mimetype,
  });
  // full file
  return {
    ipfsUrl: pinataFile && pinataFile.ipfsUrl,
    ipfsHash: pinataFile && pinataFile.ipfsHash,
    s3Url: s3File && s3File.s3Url,
    s3Key: s3File && s3File.s3Key,
    encryptedDataKey: dataKey.CiphertextBlob,
    mimetype,
  };
}

module.exports = upload;
