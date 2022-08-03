const { Readable } = require('stream');
const get = require('./get');
const IPFS = require('../../infra/utils/ipfs');
const S3 = require('../../infra/utils/s3');
const KMS = require('../../infra/utils/kms');
const { decryptStream } = require('../../infra/utils/stream');
const ipfs = new IPFS();
const s3 = new S3();
const kms = new KMS();

async function content(uuid) {
  const file = await get(uuid, false);
  const {
    name,
    s3Key,
    s3Url,
    ipfsHash,
    ipfsUrl,
    ipfsStorage,
    mimetype,
    extension,
    encryptedDataKey,
    settings,
  } = file;
  let fileContent = await s3.get({ s3Key, s3Url });
  let stream = null;
  if (fileContent) {
    stream = Readable.from(fileContent);
  } else {
    stream = await ipfs.get({ ipfsUrl, ipfsHash, ipfsStorage });
  }
  const dataKeyPlain = await kms.decrypt({ encryptedDataKey });
  const decryptedStream = Readable.from(decryptStream(stream, dataKeyPlain));
  return {
    name,
    extension,
    contentStream: decryptedStream,
    mimetype,
    settings,
  };
}

module.exports = content;
