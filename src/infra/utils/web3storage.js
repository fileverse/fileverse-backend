const Web3Storage = require('web3.storage');
const config = require('./../../../config');

class Web3StorageService {
  constructor() {
    this.client = new Web3Storage(config.WEB3STORAGE_TOKEN);
  }
}

module.exports = Web3StorageService;
