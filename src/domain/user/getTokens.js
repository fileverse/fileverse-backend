const MoralisService = require('./../../infra/utils/moralis');

const moralisService = new MoralisService();

async function getTokens(address) {
  return await moralisService.tokensFromMoralis(address);
}

module.exports = getTokens;
