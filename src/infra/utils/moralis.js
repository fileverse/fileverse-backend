const config = require('../../../config');
const axios = require('axios');
const Big = require('big.js');
const _ = require('lodash');

class MoralisService {
  constructor() {
    axios.defaults.headers.get['x-api-key'] = config.MORALIS_API_KEY;
    this.baseAddress = 'https://deep-index.moralis.io/api/v2';
    this.chain = config.CHAIN;
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
  async nftsFromMoralis(ethaddress) {
    const apiResponse = await axios.get(
      `${this.baseAddress}/${ethaddress}/nft?chain=${this.chain}&format=decimal`,
    );
    const nfts = apiResponse.data.result.map((nft) => this.formatNft(nft));
    const filteredNfts = nfts.filter(
      (nft) => nft.name && nft.symbol && nft.image,
    );
    return _.uniqBy(filteredNfts, 'contractAddress');
  }

  async tokensFromMoralis(ethaddress) {
    const apiResponse = await axios.get(
      `${this.baseAddress}/${ethaddress}/erc20?chain=${this.chain}`,
    );
    const tokens = apiResponse.data.map((token) => this.formatToken(token));

    return tokens.filter(
      (token) => token.name && token.symbol && token.thumbnail,
    );
  }

  async verifyOwnership({ address, contractAddress, tokenType }) {
    return this.getContractBalance(address, contractAddress, tokenType) > 0;
  }

  async getContractBalance({ address, contractAddress, tokenType }) {
    if (!contractAddress || !address) return 0;
    let totBal = 0;
    if (tokenType.toLowerCase() === 'erc20') {
      const apiResponse = await axios.get(
        `${this.baseAddress}/${address}/erc20?token_addresses=${contractAddress}&chain=${this.chain}`,
      );
      apiResponse.data.map((token) => {
        totBal += parseInt(token.balance, 10);
      });
    }
    if (tokenType.toLowerCase() === 'erc721') {
      const apiResponse = await axios.get(
        `${this.baseAddress}/${address}/nft/${contractAddress}?chain=${this.chain}&format=decimal`,
      );
      apiResponse.data.result.map((nft) => {
        totBal += parseInt(nft.amount, 10);
      });
    }
    return totBal;
  }

  async checkContractBalance({
    address,
    contractAddress,
    tokenType,
    gateBalance,
  }) {
    if (!contractAddress || !address || !gateBalance) return false;
    let currentBal = 0;
    if (tokenType.toLowerCase() === 'erc20') {
      const apiResponse = await axios.get(
        `${this.baseAddress}/${address}/erc20?token_addresses=${contractAddress}&chain=${this.chain}`,
      );
      apiResponse.data.map((token) => {
        const baseNumber = new Big(token.balance);
        const divideBy = new Big(10).pow(parseInt(token.decimals, 10));
        const correctedBalance = Number(baseNumber.div(divideBy).toFixed(4));
        currentBal += correctedBalance;
      });
    }
    if (tokenType.toLowerCase() === 'erc721') {
      const apiResponse = await axios.get(
        `${this.baseAddress}/${address}/nft/${contractAddress}?chain=${this.chain}&format=decimal`,
      );
      apiResponse.data.result.map((nft) => {
        currentBal += parseInt(nft.amount, 10);
      });
    }
    return gateBalance && currentBal >= gateBalance;
  }
}

module.exports = MoralisService;
