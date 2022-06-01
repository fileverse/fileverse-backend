const mongoose = require('mongoose');
const { Schema } = mongoose;

const _audience = {};

_audience.schema = new Schema(
  {
    fileUuid: {
      type: String,
    },
    inputType: {
      type: String,
      default: 'csv',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
    },
    ownerAddress: {
      type: String,
      lowercase: true,
      trim: true,
    },
    uuid: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    members: [
      {
        ensName: { type: String, trim: true },
        address: { type: String, lowercase: true, trim: true },
        airdropped: { type: Boolean, default: false },
        airdropTxHash: { type: String },
      },
    ],
    token: {
      contractAddress: { type: String, trim: true },
      name: { type: String, trim: true },
      image: { type: String, trim: true },
      gateBalance: { type: Number, default: 1 },
      tokenType: {
        type: String,
        enum: ['erc20', 'erc721'],
        default: 'erc721',
      },
      chain: { type: String, trim: true },
      creationTxHash: { type: String },
      createdOnFileverse: { type: Boolean, default: true },
      managedOnFileverse: { type: Boolean, default: true },
    },
    // system generated
    createdAt: { type: Number, required: true, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_audience.schema.pre('save', function (next) {
  const audience = this;
  audience.updatedAt = Date.now();
  next();
});

_audience.schema.methods.safeObject = function () {
  const safeFields = [
    '_id',
    'uuid',
    'inputType',
    'fileUuid',
    'owner',
    'members',
    'token',
    'createdAt',
    'updatedAt',
  ];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_audience.model = mongoose.model('audience', _audience.schema);

module.exports = _audience;
