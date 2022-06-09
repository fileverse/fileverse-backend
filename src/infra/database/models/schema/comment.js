const mongoose = require('mongoose');
const { Schema } = mongoose;

const _comment = {};

_comment.schema = new Schema(
  {
    shortId: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'accounts',
    },
    fileId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'files',
    },
    text: {
      type: String,
      trim: true,
    },
    ipfsUrl: { type: String, trim: true },
    ipfsHash: { type: String, trim: true },
    ipfsStorage: { type: String, trim: true },
    fileUuid: { type: String },
    by: { type: String },
    // system generated
    createdAt: { type: Number, required: true, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_comment.schema.pre('save', function (next) {
  const comment = this;
  comment.updatedAt = Date.now();
  next();
});

_comment.schema.methods.safeObject = function () {
  const safeFields = [
    '_id',
    'shortId',
    'user',
    'file',
    'text',
    'fileUuid',
    'by',
    'ipfsUrl',
    'ipfsHash',
    'ipfsStorage',
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

_comment.model = mongoose.model('comments', _comment.schema);

module.exports = _comment;
