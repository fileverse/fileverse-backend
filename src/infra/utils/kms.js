const config = require('../../../config');
const KMS = require('aws-sdk/clients/kms');

class KMSService {
  constructor() {
    this.accessKeyId = config.S3_ACCESS_KEY_ID;
    this.secretAccessKey = config.S3_SECRET_ACCESS_KEY;
    this.region = config.S3_BUCKET_REGION;
    this.kmsKey = config.S3_KMS_KEY;
    this.kms = new KMS({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      region: this.region,
    });
  }

  async generateDataKey({ encryptionContext } = {}) {
    const params = {
      KeyId: this.kmsKey,
      KeySpec: 'AES_256',
    };
    if (encryptionContext) {
      params.EncryptionContext = encryptionContext;
    }
    const data = await this.kms.generateDataKey(params).promise();
    return {
      Plaintext: data.Plaintext.toString('base64'),
      CiphertextBlob: data.CiphertextBlob.toString('base64'),
    };
  }

  async decrypt({ encryptedDataKey, encryptionContext = null }) {
    const params = {
      CiphertextBlob: Buffer.from(encryptedDataKey, 'base64'),
      KeyId: this.kmsKey,
    };
    if (encryptionContext) {
      params.EncryptionContext = encryptionContext;
    }
    const dataKey = await this.kms.decrypt(params).promise();
    return dataKey.Plaintext.toString('base64');
  }
}

module.exports = KMSService;
