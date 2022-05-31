const config = require('../../../config');
const axios = require('axios');
const BigInt = require('big-integer');

class AlchemyService {
  constructor() {
    this.rinkeby = config.ETHEREUM_RINKEBY_NETWORK_PROVIDER;
    this.ethereum = config.ETHEREUM_MAINNET_NETWORK_PROVIDER;
    this.polygon_mainnet = config.POLYGON_MAINNET_NETWORK_PROVIDER;
  }

  getBaseURL({ chain }) {
    if (chain === 'rinkeby') {
      return this.rinkeby;
    } else if (chain === 'polygon' || chain === 'polygon_mainnet') {
      return this.polygon_mainnet;
    }
    return this.ethereum;
  }

  async getContractMetadata({ contractAddress, chain }) {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenMetadata',
      params: [`${contractAddress}`],
      id: 42,
    });

    const config = {
      method: 'post',
      url: this.getBaseURL({ chain }),
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios(config).catch((error) => {
      console.log(error);
      return null;
    });
    const { result } = (response && response.data) || {};
    return result;
  }

  async getContractBalance({ address, contractAddress, chain, tokenType }) {
    if (!contractAddress || !address) return 0;
    const tokenMetadata = await this.getContractMetadata({
      contractAddress,
      chain,
    });
    const data = JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [`${address}`, [`${contractAddress}`]],
      id: 42,
    });

    const config = {
      method: 'post',
      url: this.getBaseURL({ chain }),
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };
    const response = await axios(config).catch((error) => {
      console.log(error);
      return null;
    });
    const { result } = (response && response.data) || {};
    if (!result) {
      return 0;
    }
    let currentBal = 0;
    console.log(result.tokenBalances);
    if (tokenType === 'erc20') {
      result.tokenBalances.map((elem) => {
        if (!elem.tokenBalance) return;
        let hexBalance = elem.tokenBalance;
        hexBalance = hexBalance.replace('0x', '0');
        const baseNumber = BigInt(hexBalance, 16);
        console.log(baseNumber);
        const divideBy = BigInt(10).pow(parseInt(tokenMetadata.decimals, 10));
        const correctedBalance = Number(
          baseNumber.divide(divideBy).toJSNumber().toFixed(2),
        );
        currentBal += correctedBalance;
      });
    } else {
      result.tokenBalances.map((elem) => {
        if (!elem.tokenBalance) return;
        let hexBalance = elem.tokenBalance;
        hexBalance = hexBalance.replace('0x', '0');
        const baseNumber = BigInt(hexBalance, 16);
        const correctedBalance = Number(baseNumber.toJSNumber().toFixed(2));
        currentBal += correctedBalance;
      });
    }
    return currentBal;
  }
}

module.exports = AlchemyService;
