const mongoose = require('mongoose');
const { Schema } = mongoose;

const _account = {};

_account.schema = new Schema(
  {
    username: { type: String, trim: true },
    name: { type: String, trim: true },
    address: { type: String, required: true, lowercase: true },
    email: { type: String, trim: true, lowercase: true },

    // system generated
    createdAt: { type: Number, required: true, default: Date.now },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_account.schema.pre('save', function (next) {
  const user = this;
  user.updatedAt = Date.now();
  next();
});

_account.schema.methods.safeObject = function () {
  const safeFields = [
    '_id',
    'username',
    'name',
    'address',
    'email',
    'createdAt',
  ];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_account.model = mongoose.model('accounts', _account.schema);

module.exports = _account;
