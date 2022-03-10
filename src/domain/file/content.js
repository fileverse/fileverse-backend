const { Readable } = require('stream');
const get = require('./get');
const Pinata = require('../../infra/utils/pinata');
const S3 = require('../../infra/utils/s3');
const KMS = require('../../infra/utils/kms');
const { decryptStream } = require('../../infra/utils/stream');
const pinata = new Pinata();
const s3 = new S3();
const kms = new KMS();

async function content(uuid) {
  const file = await get(uuid, false);
  const { name, s3Key, s3Url, ipfsHash, ipfsUrl, mimetype, encryptedDataKey } =
    file;
  let fileContent = await s3.get({ s3Key, s3Url });
  let stream = null;
  if (fileContent) {
    stream = Readable.from(fileContent);
  } else {
    stream = await pinata.get({ ipfsUrl, ipfsHash });
  }
  const dataKeyPlain = await kms.decrypt({ encryptedDataKey });
  const decryptedStream = Readable.from(decryptStream(stream, dataKeyPlain));
  return {
    name,
    contentStream: decryptedStream,
    mimetype,
  };
}

module.exports = content;
