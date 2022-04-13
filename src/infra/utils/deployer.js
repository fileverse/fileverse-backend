const Big = require('big.js');
const config = require('../../../config');
const { abi, bytecode } = require('../../../contracts/FileverseNFT_v1.json');
const ethers = require('ethers');

class DeployerService {
  constructor({ chain, type }) {
    this.rinkeby = config.ETHEREUM_RINKEBY_NETWORK_PROVIDER;
    this.ethereum = config.ETHEREUM_MAINNET_NETWORK_PROVIDER;
    this.polygon_mainnet = config.POLYGON_MAINNET_NETWORK_PROVIDER;
    this.gnosis = config.GNOSIS_NETWORK_PROVIDER;
    this.privateKey = config.SIGNER_PRIVATE_KEY;
    this.chain = chain;
    this.type = type;
  }

  getNetworkProviderURL({ chain }) {
    if (chain === 'rinkeby') {
      return this.rinkeby;
    } else if (chain === 'polygon_mainnet') {
      return this.polygon_mainnet;
    } else if (chain === 'gnosis') {
      return this.gnosis;
    }
    return this.ethereum;
  }

  async getNetworkProvider(chain) {
    const url = this.getNetworkProviderURL({ chain });
    const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
    return customHttpProvider;
  }

  async getContractABI() {
    if (this.type === 'erc721') {
      return abi;
    }
    return abi;
  }

  async getSigner() {
    const networkProvider = await this.getNetworkProvider(this.chain);
    const signer = new ethers.Wallet(this.privateKey, networkProvider);
    return signer;
  }

  async deployContractInstance({ name, symbol }) {
    const abi = await this.getContractABI();
    const signer = await this.getSigner();
    const contractFactoryInstance = new ethers.ContractFactory(
      abi,
      bytecode,
      signer,
    );
    const contract = await contractFactoryInstance.deploy(name, symbol);
    await contract.deployed();
    return contract;
  }

  async isOwner({ contractAddress }) {
    const abi = await this.getContractABI();
    const signer = await this.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    try {
      const ownerAddress = await contractInstance.owner();
      return ownerAddress.toLowerCase() === signer.address.toLowerCase();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getContractIntance({ contractAddress }) {
    const abi = await this.getContractABI();
    const signer = await this.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    return contractInstance;
  }

  async getContractBalance({ contractAddress, address }) {
    const contractInstance = await this.getContractIntance({ contractAddress });
    let rawBalance = 0;
    let balance = 0;
    try {
      rawBalance = await contractInstance.balanceOf(address);
    } catch (error) {
      console.log(error);
      rawBalance = 0;
    }
    if (this.type === 'erc721') {
      balance = Number(new Big(rawBalance).toFixed(0));
      return balance;
    }
    let decimal = 1;
    try {
      decimal = await contractInstance.decimal();
    } catch (error) {
      console.log(error);
      decimal = 1;
    }
    const baseNumber = new Big(rawBalance);
    const divideBy = new Big(10).pow(decimal);
    balance = Number(baseNumber.div(divideBy).toFixed(2));
    return balance;
  }

  async mint({ contractAddress, addressList }) {
    const abi = await this.getContractABI();
    const signer = await this.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contractInstance.batchMint(addressList);
      await tx.wait();
      return tx;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async transferOwnership({ contractAddress, address }) {
    const abi = await this.getContractABI();
    const signer = await this.getSigner();
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    try {
      const tx = await contractInstance.transferOwnership(address);
      await tx.wait();
      return tx;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = DeployerService;
