const Moralis = require('./moralis');

const moralisInstance = new Moralis();

class Balance {
  constructor() {}

  getChainCode({ chain }) {
    if (chain === 'rinkeby') {
      return '0x4';
    } else if (chain === 'polygon_mainnet') {
      return '0x89';
    }
    return '0x1';
  }

  async getTokenBalance({ contractAddress, chain, address }) {
    const chainCode = this.getNetworkName({ chain });
    return moralisInstance.getContractBalance({
      address,
      contractAddress,
      chain: chainCode,
      tokenType: 'erc20',
    });
  }

  async getNFTBalance({ contractAddress, chain, address }) {
    const chainCode = this.getNetworkName({ chain });
    return moralisInstance.getContractBalance({
      address,
      contractAddress,
      chain: chainCode,
      tokenType: 'erc721',
    });
  }

  async verifyGreaterBalance({
    contractAddress,
    chain = 'ethereum',
    address,
    type,
    gateBalance,
  }) {
    let balance = 0;
    if (type === 'erc20') {
      balance = await this.getTokenBalance({ contractAddress, chain, address });
    } else {
      balance = await this.getNFTBalance({ contractAddress, chain, address });
    }
    return balance >= gateBalance;
  }
}

module.exports = Balance;
