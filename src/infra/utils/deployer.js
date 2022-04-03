const config = require('../../../config');
const ethers = require('ethers');
const Big = require('big.js');

class TokenService {
  constructor() {
    this.gnosis = config.GNOSIS_MAINNET_NETWORK_PROVIDER;
    this.rinkeby = config.ETHEREUM_RINKEBY_NETWORK_PROVIDER;
    this.ethereum = config.ETHEREUM_MAINNET_NETWORK_PROVIDER;
    this.polygon_mainnet = config.POLYGON_MAINNET_NETWORK_PROVIDER;
  }

  getNetworkProviderURL({ chain }) {
    if (chain === 'rinkeby') {
      return this.rinkeby;
    } else if (chain === 'gnosis') {
      return this.rinkeby;
    } else if (chain === 'polygon_mainnet') {
      return this.polygon_mainnet;
    }
    return this.ethereum;
  }

  async getNetworkProvider(chain) {
    const url = this.getNetworkProviderURL({ chain });
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    return customHttpProvider;
  }

  async getContractABI() {
    return [
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ];
  }

  async getContractInstance({ contractAddress, chain, type }) {
    const networkProvider = await this.getNetworkProvider({ chain });
    const abi = await this.getContractABI({ type });
    console.log({ networkProvider, abi });
    const contractInstance = new ethers.Contract(
      contractAddress,
      abi,
      networkProvider,
    );
    return contractInstance;
  }

  async getTokenBalance({ contractAddress, chain, address }) {
    const contractInstance = await this.getContractInstance({
      contractAddress,
      chain,
      type: 'erc20',
    });
    let balance = 0;
    let decimals = 1;
    try {
      const rawBalance = await contractInstance.balanceOf(address);
      decimals = await contractInstance.decimals();
      const baseNumber = new Big(rawBalance);
      const divideBy = new Big(10).pow(decimals);
      balance = Number(baseNumber.div(divideBy).toFixed(2));
    } catch (error) {
      console.log(error);
      balance = 0;
      decimals = 1;
    }
    return balance;
  }

  async getNFTBalance({ contractAddress, chain, address }) {
    const contractInstance = await this.getContractInstance({
      contractAddress,
      chain,
      type: 'nft',
    });
    let balance = 0;
    try {
      const rawBalance = await contractInstance.balanceOf(address);
      balance = Number(new Big(rawBalance).toFixed(0));
    } catch (error) {
      console.log(error);
      balance = 0;
    }
    return balance;
  }

  async verifyGreaterBalance({
    contractAddress,
    chain,
    address,
    tokenType,
    gateBalance,
  }) {
    let balance = 0;
    if (tokenType === 'erc20') {
      balance = this.getTokenBalance({ contractAddress, chain, address });
    } else {
      balance = this.getNFTBalance({ contractAddress, chain, address });
    }
    return balance >= gateBalance;
  }
}

module.exports = TokenService;
