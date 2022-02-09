const MoralisService = require('../../infra/utils/moralis');

const moralisService = new MoralisService();

async function getNfts(address, search) {
  return await moralisService.nftsFromMoralis(address, search);
}

module.exports = getNfts;
