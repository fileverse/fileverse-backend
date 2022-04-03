const NFTPort = require('./nftport');
const Moralis = require('./moralis');

const moralisInstance = new Moralis();
const nftPortInstance = new NFTPort();

class NFT {
  constructor() {}

  async getOwnedNFTs({ chain, address }) {
    if (chain === 'rinkeby' || chain === 'ethereum') {
      return moralisInstance.getOwnedNFTs(address, chain);
    } else {
      return nftPortInstance.getOwnedNFTs(address, chain);
    }
  }
}

module.exports = NFT;
