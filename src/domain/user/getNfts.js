const MoralisService = require('../../infra/utils/moralis');

const moralisService = new MoralisService();

async function getNfts({ address, search }) {
  const nfts = await moralisService.nftsFromMoralis(address);
  // eslint-disable-next-line
  return nfts.filter((nft) => nft.name.match(new RegExp(search, 'i')));
}

module.exports = getNfts;
