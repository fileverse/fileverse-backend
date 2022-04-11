const mongoose = require('mongoose');
const { Schema } = mongoose;

const _audience = {};

_audience.schema = new Schema(
  {
    inputType: {
      type: String,
      default: 'csv',
    },
    owner: {
      type: String,
    },
    uuid: {
      type: String,
      required: true,
      trim: true,
    },
    members: [
      {
        ensName: { type: String, trim: true },
        address: { type: String },
      },
    ],
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
    'owner',
    'members',
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
