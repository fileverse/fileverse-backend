require('../');

const _models = {
  Session: require('./schema/session').model,
  Account: require('./schema/account').model,
  File: require('./schema/file').model,
  Comment: require('./schema/comment').model,
  Audience: require('./schema/audience').model,
  Log: require('./schema/log').model,
  Org: require('./schema/org').model,
};

module.exports = _models;
