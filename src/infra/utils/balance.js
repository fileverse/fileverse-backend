const Moralis = require('./moralis');
const Deployer = require('./deployer');

const moralisInstance = new Moralis();
const deployerInstance = new Deployer();

class Balance {
  constructor() {}

  async getTokenBalance({ contractAddress, chain, address }) {
    if (chain === 'gnosis') {
      return deployerInstance.getContractBalance({
        address,
        contractAddress,
        tokenType: 'erc721',
      });
    }
    return moralisInstance.getContractBalance({
      address,
      contractAddress,
      chain,
      tokenType: 'erc20',
    });
  }

  async getNFTBalance({ contractAddress, chain, address }) {
    if (chain === 'gnosis') {
      return deployerInstance.getContractBalance({
        address,
        contractAddress,
        tokenType: 'erc721',
      });
    }
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
    tokenType,
    gateBalance,
  }) {
    let balance = 0;
    if (tokenType === 'erc20') {
      balance = await this.getTokenBalance({ contractAddress, chain, address });
    } else {
      balance = await this.getNFTBalance({ contractAddress, chain, address });
    }
    return balance >= gateBalance;
  }
}

module.exports = Balance;
