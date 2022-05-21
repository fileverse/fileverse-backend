const { Readable } = require('stream');
const S3 = require('../../infra/utils/s3');
const ReadableStreamClone = require('readable-stream-clone');
const { encryptStream } = require('../../infra/utils/stream');
const KMS = require('../../infra/utils/kms');
const Web3StorageService = require('./../../infra/utils/web3storage');
const s3 = new S3();
const kms = new KMS();
const web3Storage = new Web3StorageService();

async function upload(file) {
  const { name, mimetype, data } = file;
  const dataKey = await kms.generateDataKey();
  const stream = Readable.from(data);
  const encryptedStreamWeb3Storage = Readable.from(
    encryptStream(stream, dataKey.Plaintext),
  );
  encryptedStreamWeb3Storage.path = name;

  const w3File = await web3Storage.upload(encryptedStreamWeb3Storage, name);

  console.log({ w3File });

  const encryptedStreamS3 = new ReadableStreamClone(encryptedStreamWeb3Storage);
  encryptedStreamS3.path = name;
  const s3File = await s3.upload(encryptedStreamS3, {
    name: w3File.ipfsHash,
    mimetype,
  });
  // full file
  return {
    ipfsUrl: w3File && w3File.ipfsUrl,
    ipfsHash: w3File && w3File.ipfsHash,
    s3Url: s3File && s3File.s3Url,
    s3Key: s3File && s3File.s3Key,
    encryptedDataKey: dataKey.CiphertextBlob,
    mimetype,
  };
}

module.exports = upload;
