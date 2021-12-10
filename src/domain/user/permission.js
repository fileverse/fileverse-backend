const { Account } = require('../../infra/database/models');

function setRead() {
  return true;
}

function setWrite({ accountOwner, viewer }) {
  if (!accountOwner || !viewer) {
    return false;
  }
  return accountOwner.toString() === viewer.toString();
}

async function permission({ address, userId }) {
  const account = await Account.findOne({ address });
  const permission = {
    read: false,
    edit: false,
  };
  permission.read = setRead({
    accountOwner: account && account._id,
    viewer: userId,
  });
  permission.write = setWrite({
    accountOwner: account && account._id,
    viewer: userId,
  });
  return permission;
}

module.exports = permission;
