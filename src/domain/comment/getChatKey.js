const NodeCache = require('node-cache');
const { File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const KMS = require('../../infra/utils/kms');
const kms = new KMS();
const chatKeyCache = new NodeCache({ stdTTL: 21600 });

async function getChatKey(uuid) {
  const foundFile = await File.findOne({ uuid });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: `Could not find file with uuid ${uuid}`,
    });
  }
  let chatKey = '';
  if (!foundFile.encryptedChatKey) {
    const kmsKey = await kms.generateDataKey();
    foundFile.encryptedChatKey = kmsKey.CiphertextBlob;
    chatKey = kmsKey.Plaintext;
    await foundFile.save();
  } else {
    chatKey = chatKeyCache.get(foundFile.encryptedChatKey);
    if (!chatKey) {
      console.log('cache miss');
      chatKey = await kms.decrypt({
        encryptedDataKey: foundFile.encryptedChatKey,
      });
      chatKeyCache.set(foundFile.encryptedChatKey, chatKey);
    }
  }
  return chatKey;
}

module.exports = getChatKey;
