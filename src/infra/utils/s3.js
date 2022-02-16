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
      fileLink: file.Location,
    };
  }

  async upload(data, { name, mimetype }) {
    const params = {
      Body: data,
      Key: `files/${name}`,
      ContentType: mimetype,
      Bucket: this.bucketName,
    };
    const file = await this.s3.upload(params).promise();
    return this.formatFile(file);
  }

  async uploadFromStream(stream, name, mimetype) {
    const params = {
      Bucket: this.bucketName,
      Key: `files/${name}`,
      Body: stream,
      ContentType: mimetype,
    };
    const file = await this.s3.upload(params).promise();
    return this.formatFile(file);
  }
}

module.exports = S3Service;
