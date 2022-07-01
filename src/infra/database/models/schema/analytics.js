const mongoose = require('mongoose');
const { Schema } = mongoose;

const _analytics = {};

_analytics.schema = new Schema({
  eventName: { type: String, required: true },
  fileUuid: { type: String, required: true },
  timeStamp: { type: Number, required: true, default: Date.now },
});

_analytics.schema.pre('save', function (next) {
  this.timeStamp = Date.now();
  next();
});

_analytics.schema.methods.safeObject = function () {
  const safeFields = ['_id', 'eventName', 'fileUuid', 'timeStamp'];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_analytics.model = mongoose.model('analytics', _analytics.schema);

module.exports = _analytics;
