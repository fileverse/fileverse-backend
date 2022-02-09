const config = require('../../../config');
const axios = require('axios');
const _ = require('lodash');

class MoralisService {
  constructor() {
    axios.defaults.headers.get['x-api-key'] = config.MORALIS_API_KEY;
    this.baseAddress = 'https://deep-index.moralis.io/api/v2';
  }

  formatNft(nft) {
    const metadata = JSON.parse(nft.metadata);
    return {
      contractAddress: nft.token_address,
      name: metadata ? metadata.name : nft.name,
      image: metadata ? metadata.image : nft.image,
      symbol: nft.symbol,
    };
  }

  formatToken(token) {
    return {
      contractAddress: token.token_address,
      name: token.name,
      symbol: token.symbol,
      thumbnail: token.thumbnail,
    };
  }

  // get Nfts from Moralis and return only those with name, symbol and image and unique address.
  async nftsFromMoralis(ethaddress, search) {
    console.log({ search });
    const apiResponse = await axios.get(
      `${this.baseAddress}/${ethaddress}/nft?chain=eth&format=decimal`,
    );
    const nfts = apiResponse.data.result.map((nft) => this.formatNft(nft));
    const filteredNfts = nfts.filter(
      (nft) =>
        nft.name &&
        nft.symbol &&
        nft.image &&
        nft.name.match(new RegExp(search, 'i')),
    );
    return _.uniqBy(filteredNfts, 'contractAddress');
  }

  async tokensFromMoralis(ethaddress) {
    const apiResponse = await axios.get(
      `${this.baseAddress}/${ethaddress}/erc20?chain=eth`,
    );
    const tokens = apiResponse.data.map((token) => this.formatToken(token));

    return tokens;
  }
}

module.exports = MoralisService;
