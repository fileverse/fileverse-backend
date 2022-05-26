const mongoose = require('mongoose');
const config = require('../../../../../config');
const { Schema } = mongoose;

const _file = {};

const VersionSchema = new Schema({
  ipfsUrl: { type: String, trim: true },
  ipfsHash: { type: String, trim: true },
  s3Url: { type: String, trim: true },
  s3Key: { type: String, trim: true },
  mimetype: { type: String, trim: true },
  version: { type: Number },
});

const TokenSchema = new Schema({
  contractAddress: { type: String, trim: true },
  name: { type: String, trim: true },
  image: { type: String, trim: true },
  gateBalance: { type: Number, default: 0 },
  tokenType: {
    type: String,
    enum: ['erc20', 'erc721'],
  },
  chain: { type: String, trim: true, default: config.CHAIN },
  audienceUuid: { type: String },
});

_file.schema = new Schema(
  {
    uuid: { type: String },
    name: { type: String, trim: true },
    url: { type: String, trim: true },
    ipfsUrl: { type: String, trim: true },
    ipfsHash: { type: String, trim: true },
    ipfsStorage: { type: String, trim: true },
    s3Url: { type: String, trim: true },
    s3Key: { type: String, trim: true },
    encryptedDataKey: { type: String, trim: true },
    mimetype: { type: String, trim: true },
    currentVersion: { type: Number, default: 1 },
    permission: {
      type: String,
      enum: ['public', 'private', 'unlisted', 'token-gated'],
      default: 'public',
    },
    version: [VersionSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
    },
    token: TokenSchema,
    slug: { type: String, trim: true, unique: true },
    description: { type: String, trim: true },

    // system generated
    createdAt: { type: Number, required: true, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_file.schema.pre('save', function (next) {
  const file = this;
  if (file.token) {
    file.permission = 'token-gated';
  }
  file.updatedAt = Date.now();
  next();
});

_file.schema.methods.safeObject = function () {
  const safeFields = [
    '_id',
    'url',
    'uuid',
    'currentVersion',
    'mimetype',
    'name',
    'permission',
    'ipfsUrl',
    'ipfsHash',
    's3Key',
    's3Url',
    'owner',
    'public',
    'version',
    'createdAt',
    'token',
    'slug',
    'description',
  ];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_file.model = mongoose.model('files', _file.schema);

module.exports = _file;
