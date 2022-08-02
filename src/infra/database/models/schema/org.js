const mongoose = require('mongoose');
const { Schema } = mongoose;

const _org = {};

_org.schema = new Schema(
  {
    address: { type: String, lowercase: true },
    subdomain: { type: String, trim: true },
    name: { type: String, trim: true },
    description: { type: String, trim: true },
    logo: { type: String },
    cover: { type: String },
    deployTxHash: { type: String },
    deployTxLink: { type: String },
    deployTxStatus: { type: String },
    // system generated
    createdAt: { type: Number, required: true, default: Date.now },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_org.schema.pre('save', function (next) {
  const user = this;
  user.updatedAt = Date.now();
  next();
});

_org.schema.methods.safeObject = function () {
  const safeFields = [
    '_id',
    'address',
    'subdomain',
    'name',
    'description',
    'logo',
    'cover',
    'createdAt',
  ];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_org.model = mongoose.model('orgs', _org.schema);

module.exports = _org;
