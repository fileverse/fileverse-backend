const { Account } = require('../../infra/database/models');

async function createAccount({ address, subdomain }) {
  const foundAccount = await Account.findOne({ address });
  if (subdomain) {
    let subdomainList = foundAccount.subdomain || [];
    const found = subdomainList.find((elem) => elem === subdomain);
    if (!found) {
      subdomainList.push(subdomain);
      foundAccount.subdomain = subdomainList;
      await foundAccount.save();
    }
  }
  if (foundAccount) {
    return foundAccount._id;
  }
  const subdomainList = subdomain ? [subdomain] : [];
  const createdAccount = await new Account({
    address,
    subdomain: subdomainList,
  }).save();
  return createdAccount._id;
}

module.exports = createAccount;
