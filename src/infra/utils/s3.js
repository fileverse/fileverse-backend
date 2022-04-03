const config = require('../../../config');
const S3 = require('aws-sdk/clients/s3');

class S3Service {
  constructor() {
    this.accessKeyId = config.S3_ACCESS_KEY_ID;
    this.secretAccessKey = config.S3_SECRET_ACCESS_KEY;
    this.bucketName = config.S3_BUCKET_NAME;
    this.region = config.S3_BUCKET_REGION;
    this.s3 = new S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
      bucketName: this.bucketName,
      region: this.region,
    });
  }

  formatFile(file) {
    return {
      s3Key: file.key,
      s3Url: `https://${config.S3_BUCKET_NAME}/${file.key}`,
    };
  }

  async upload(data, { name, mimetype, base = 'files' }) {
    const params = {
      Body: data,
      Key: `${base}/${name}`,
      ContentType: mimetype,
      Bucket: this.bucketName,
    };
    const file = await this.s3.upload(params).promise();
    return this.formatFile(file);
  }

  async get({ s3Key }) {
    if (!s3Key) {
      return null;
    }
    const params = {
      Key: s3Key,
      Bucket: this.bucketName,
    };
    const file = await this.s3.getObject(params).promise();
    return file && file.Body;
  }

  async remove({ s3Key }) {
    const params = {
      Key: s3Key,
      Bucket: this.bucketName,
    };
    const result = await this.s3.deleteObject(params).promise();
    console.log(result);
  }
}

module.exports = S3Service;
