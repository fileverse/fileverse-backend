const { Readable } = require('stream');
const IPFS = require('./../../infra/utils/ipfs');
const ipfs = new IPFS();

async function upload(comment) {
  const { shortId, fileUuid, text } = comment;
  const name = `${fileUuid}_${shortId}.enc.txt`;
  const stream = Readable.from(text);
  stream.path = name;
  const ipfsFile = await ipfs.upload(stream, { name });
  // full file
  return {
    ipfsUrl: ipfsFile && ipfsFile.ipfsUrl,
    ipfsHash: ipfsFile && ipfsFile.ipfsHash,
    ipfsStorage: ipfsFile && ipfsFile.ipfsStorage,
    mimetype: 'text/plain',
  };
}

module.exports = upload;
