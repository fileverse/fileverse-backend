const Moralis = require('./moralis');
const Deployer = require('./deployer');

const moralisInstance = new Moralis();
const deployerNFTInstance = new Deployer({
  chain: 'gnosis',
  type: 'erc721',
});
const deployerTokenInstance = new Deployer({
  chain: 'gnosis',
  type: 'erc20',
});

class Balance {
  constructor() {}

  async getTokenBalance({ contractAddress, chain, address }) {
    if (chain === 'gnosis') {
      return deployerTokenInstance.getContractBalance({
        address,
        contractAddress,
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
      return deployerNFTInstance.getContractBalance({
        address,
        contractAddress,
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
