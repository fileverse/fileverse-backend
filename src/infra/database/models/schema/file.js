const mongoose = require('mongoose');
const { Schema } = mongoose;

const _file = {};

const VersionSchema = new Schema({
  url: { type: String },
  version: { type: Number },
});

_file.schema = new Schema(
  {
    uuid: { type: String },
    name: { type: String, trim: true },
    url: { type: String, trim: true },
    mimetype: { type: String, trim: true },
    currentVersion: { type: Number, default: 1 },
    permission: {
      type: String,
      enum: ['public', 'private', 'unlisted'],
      default: 'public',
    },
    version: [VersionSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
    },

    // system generated
    createdAt: { type: Number, required: true, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
  },
  { usePushEach: true },
  { runSettersOnQuery: true },
);

_file.schema.pre('save', function (next) {
  const file = this;
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
    'owner',
    'public',
    'version',
    'createdAt',
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
