const mongoose = require('mongoose');
const { Schema } = mongoose;

const _session = {};

_session.schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
    },
    address: { type: String, required: true, lowercase: true },

    // system generated
    createdAt: { type: Number, required: true, default: Date.now },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_session.schema.methods.safeObject = function () {
  const safeFields = ['_id', 'userId', 'address', 'createdAt'];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_session.model = mongoose.model('sessions', _session.schema);

module.exports = _session;
