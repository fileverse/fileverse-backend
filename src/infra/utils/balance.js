const Moralis = require('./moralis');

const moralisInstance = new Moralis();

class Balance {
  constructor() {}

  async getTokenBalance({ contractAddress, chain, address }) {
    return moralisInstance.getContractBalance({
      address,
      contractAddress,
      chain,
      tokenType: 'erc20',
    });
  }

  async getNFTBalance({ contractAddress, chain, address }) {
    return moralisInstance.getContractBalance({
      address,
      contractAddress,
      chain,
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
