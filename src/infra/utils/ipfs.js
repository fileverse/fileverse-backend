const config = require('../../../config');
const Web3StorageService = require('./web3storage');
const Pinata = require('./pinata');

class IPFS {
  constructor() {
    this.web3Storage = new Web3StorageService();
    this.pinata = new Pinata();
    this.defaultService = config.DEFAULT_IPFS_SERVICE || 'pinata';
  }

  async upload(readableStreamForFile, { name, attributes }) {
    if (this.defaultService === 'web3.storage') {
      return this.web3Storage.upload(readableStreamForFile, {
        name,
        attributes,
      });
    }
    return this.pinata.upload(readableStreamForFile, { name, attributes });
  }

  async get({ ipfsUrl, ipfsStorage }) {
    if (ipfsStorage === 'web3.storage') {
      return this.web3Storage.get({ ipfsUrl });
    }
    return this.pinata.get({ ipfsUrl });
  }

  async remove({ ipfsHash, ipfsStorage }) {
    if (ipfsStorage === 'web3.storage') {
      return this.web3Storage.remove({ ipfsHash });
    }
    return this.pinata.remove({ ipfsHash });
  }
}

module.exports = IPFS;
