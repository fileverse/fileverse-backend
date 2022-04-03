const Zapper = require('./../../infra/utils/zapper');

const zapperInstance = new Zapper();

async function getTokens({ address, search }) {
  const tokens = await zapperInstance.getOwnedTokens(address);
  return tokens.filter((token) =>
    // eslint-disable-next-line
    token.name.match(new RegExp(search, 'i')),
  );
}

module.exports = getTokens;
