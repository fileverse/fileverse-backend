const short = require('short-uuid');
const { Comment, File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const KMS = require('../../infra/utils/kms');
const { encryptStream } = require('../../infra/utils/stream');
const { Readable } = require('stream');
const IPFS = require('../../infra/utils/ipfs');

const ipfs = new IPFS();

const kms = new KMS();
async function create({ userId, fileUuid, text, address }) {
  const shortId = short.generate();

  const file = await File.findOne({ uuid: fileUuid });

  if (!file) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }

  let chatKey = '';
  if (!file.encryptedChatKey) {
    const kmsKey = await kms.generateDataKey();
    file.encryptedChatKey = kmsKey.CiphertextBlob;
    chatKey = kmsKey.Plaintext;
    await file.save();
  } else {
    chatKey = await kms.decrypt({ encryptedDataKey: file.encryptedChatKey });
  }

  const stream = Readable.from(text);
  const encryptedStreamChat = Readable.from(encryptStream(stream, chatKey));

  const ipfsFile = await ipfs.upload(encryptedStreamChat, { name: shortId });

  const comment = await new Comment({
    shortId,
    userId,
    fileId: file._id,
    fileUuid: file.uuid,
    by: address,
    ipfsHash: ipfsFile.ipfsHash,
    ipfsUrl: ipfsFile.ipfsUrl,
    ipfsStorage: ipfsFile.ipfsStorage,
  }).save();

  return comment.safeObject();
}

module.exports = create;
