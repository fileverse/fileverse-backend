const MoralisService = require('./../../infra/utils/moralis');

const moralisService = new MoralisService();

async function getTokens({ address, search }) {
  const tokens = await moralisService.tokensFromMoralis(address);
  return tokens.filter((token) =>
    // eslint-disable-next-line
    token.name.match(new RegExp(search, 'i')),
  );
}

module.exports = getTokens;
