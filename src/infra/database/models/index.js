require('../');

const _models = {
  Session: require('./schema/session').model,
  Account: require('./schema/account').model,
  File: require('./schema/file').model,
  Comment: require('./schema/comment').model,
};

module.exports = _models;
