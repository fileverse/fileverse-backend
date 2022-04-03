const NFTPort = require('../../infra/utils/nftport');

const nftPortInstance = new NFTPort();

async function getNfts({ address, search }) {
  const nfts = await nftPortInstance.getOwnedNFTs(address);
  // eslint-disable-next-line
  return nfts.filter((nft) => nft.name.match(new RegExp(search, 'i')));
}

module.exports = getNfts;
