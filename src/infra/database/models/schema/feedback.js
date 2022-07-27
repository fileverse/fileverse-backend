const mongoose = require('mongoose');
const { Schema } = mongoose;

const _feedback = {};

_feedback.schema = new Schema({
  url: { type: String, required: true },
  comment: { type: String },
  address: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now },
});

_feedback.schema.pre('save', function (next) {
  this.timeStamp = Date.now();
  next();
});

_feedback.schema.methods.safeObject = function () {
  const safeFields = ['_id', 'url', 'comment', 'address', 'email'];
  const newSafeObject = {};
  safeFields.forEach((elem) => {
    // eslint-disable-next-line security/detect-object-injection
    newSafeObject[elem] = this[elem];
  });
  return newSafeObject;
};

_feedback.model = mongoose.model('feedbacks', _feedback.schema);

module.exports = _feedback;
