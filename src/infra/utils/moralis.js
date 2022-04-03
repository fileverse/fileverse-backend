const config = require('../../../config');
const axios = require('axios');
const Big = require('big.js');

class MoralisService {
  constructor() {
    axios.defaults.headers.get['x-api-key'] = config.MORALIS_API_KEY;
    this.baseAddress = 'https://deep-index.moralis.io/api/v2';
  }

  getChainCode({ chain }) {
    if (chain === 'rinkeby') {
      return '0x4';
    } else if (chain === 'polygon_mainnet') {
      return '0x89';
    }
    return '0x1';
  }

  async getContractBalance({ address, contractAddress, tokenType, chain }) {
    const chainCode = this.getChainCode({ chain });
    if (!contractAddress || !address) return 0;
    let currentBal = 0;
    if (tokenType.toLowerCase() === 'erc20') {
      const apiResponse = await axios.get(
        `${this.baseAddress}/${address}/erc20?token_addresses=${contractAddress}&chain=${chainCode}`,
      );
      apiResponse.data.map((token) => {
        const baseNumber = new Big(token.balance);
        const divideBy = new Big(10).pow(parseInt(token.decimals, 10));
        const correctedBalance = Number(baseNumber.div(divideBy).toFixed(2));
        currentBal += correctedBalance;
      });
    }
    if (tokenType.toLowerCase() === 'erc721') {
      const apiResponse = await axios.get(
        `${this.baseAddress}/${address}/nft/${contractAddress}?chain=${chainCode}&format=decimal`,
      );
      apiResponse.data.result.map((nft) => {
        currentBal += parseInt(nft.amount, 10);
      });
    }
    return currentBal;
  }
}

module.exports = MoralisService;
