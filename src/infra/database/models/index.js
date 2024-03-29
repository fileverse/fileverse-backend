require('../');

const _models = {
  Session: require('./schema/session').model,
  Account: require('./schema/account').model,
  File: require('./schema/file').model,
  Comment: require('./schema/comment').model,
  Audience: require('./schema/audience').model,
  Log: require('./schema/log').model,
  Feedback: require('./schema/feedback').model,
};

module.exports = _models;
