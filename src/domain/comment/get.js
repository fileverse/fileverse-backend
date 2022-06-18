const { File, Comment } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const IPFS = require('./../../infra/utils/ipfs');
const { decryptStream } = require('../../infra/utils/stream');
const { Readable } = require('stream');
const KMS = require('./../../infra/utils/kms');

const ipfs = new IPFS();
const kms = new KMS();

async function get(fileUuid) {
  const file = await File.findOne({ uuid: fileUuid });
  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }

  const dataKeyPlain = await kms.decrypt({
    encryptedDataKey: file.encryptedChatKey,
  });

  const comments = await Comment.find({ fileId: file._id });
  const allCommentsPromises = comments.map(async (comment) => {
    if (comment.ipfsUrl) {
      const { ipfsUrl, ipfsHash, ipfsStorage } = comment;
      const stream = await ipfs.get({ ipfsUrl, ipfsHash, ipfsStorage });
      const decryptedStream = Readable.from(
        decryptStream(stream, dataKeyPlain),
      );
      const text = await streamToString(decryptedStream);
      comment.text = text;
    }
    return comment;
  });
  return await Promise.all(allCommentsPromises);
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf-8');
}

module.exports = get;
