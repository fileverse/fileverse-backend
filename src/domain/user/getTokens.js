const config = require('../../../config');
const Token = require('./../../infra/utils/token');

const tokenInstance = new Token();

async function getTokens({ address, search }) {
  const tokens = await tokenInstance.getOwnedTokens({
    address,
    chain: config.chain,
  });
  return tokens.filter((token) =>
    // eslint-disable-next-line
    token.name.match(new RegExp(search, 'i')),
  );
}

module.exports = getTokens;
