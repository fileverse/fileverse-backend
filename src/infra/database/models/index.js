require('../');

const _models = {
  Account: require('./schema/account').model,
  File: require('./schema/file').model,
};

module.exports = _models;
