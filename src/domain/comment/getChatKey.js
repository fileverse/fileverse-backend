const { File } = require('../../infra/database/models');
const ErrorHandler = require('../../infra/utils/errorHandler');
const KMS = require('../../infra/utils/kms');
const kms = new KMS();

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
    chatKey = await kms.decrypt({
      encryptedDataKey: foundFile.encryptedChatKey,
    });
  }
  return chatKey;
}

module.exports = getChatKey;
