require('../');

const _models = {
  Session: require('./schema/session').model,
  Account: require('./schema/account').model,
  File: require('./schema/file').model,
  Comment: require('./schema/comment').model,
  Audience: require('./schema/audience').model,
  Analytics: require('./schema/analytics').model,
};

module.exports = _models;
