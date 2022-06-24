const { Readable } = require('stream');
const S3 = require('../../infra/utils/s3');
const ReadableStreamClone = require('readable-stream-clone');
const { encryptStream } = require('../../infra/utils/stream');
const KMS = require('../../infra/utils/kms');
const IPFS = require('./../../infra/utils/ipfs');
const s3 = new S3();
const kms = new KMS();
const ipfs = new IPFS();

async function upload(file) {
  const { name, mimetype, data } = file;
  const dataKey = await kms.generateDataKey();
  const stream = Readable.from(data);
  const encryptedStreamWeb3Storage = Readable.from(
    encryptStream(stream, dataKey.Plaintext),
  );
  encryptedStreamWeb3Storage.path = name;
  const encryptedStreamS3 = new ReadableStreamClone(encryptedStreamWeb3Storage);
  encryptedStreamS3.path = name;
  const ipfsFile = await ipfs.upload(encryptedStreamWeb3Storage, { name });
  const s3File = await s3.upload(encryptedStreamS3, {
    name: ipfsFile.ipfsHash,
    mimetype,
  });
  // full file
  return {
    ipfsUrl: ipfsFile && ipfsFile.ipfsUrl,
    ipfsHash: ipfsFile && ipfsFile.ipfsHash,
    ipfsStorage: ipfsFile && ipfsFile.ipfsStorage,
    s3Url: s3File && s3File.s3Url,
    s3Key: s3File && s3File.s3Key,
    encryptedDataKey: dataKey.CiphertextBlob,
    mimetype,
  };
}

module.exports = upload;
