const config = require('../../../config');
const Token = require('./../../infra/utils/token');

const tokenInstance = new Token();

async function getTokens({ address, search, chain }) {
  const tokens = await tokenInstance.getOwnedTokens({
    address,
    chain: chain || config.CHAIN,
  });
  // eslint-disable-next-line
  return tokens.filter((token) => token.name.match(new RegExp(search, 'i')));
}

module.exports = getTokens;
