const { Web3Storage, Blob } = require('web3.storage');
const config = require('./../../../config');

class Web3StorageService {
  constructor() {
    console.log({ token: config.WEB3STORAGE_TOKEN });
    this.client = new Web3Storage({ token: config.WEB3STORAGE_TOKEN });
  }

  async upload(file) {
    let buffer = Buffer.from(file.data);
    let arraybuffer = Uint8Array.from(buffer).buffer;
    let blob = new Blob([arraybuffer], { type: file.mimetype });
    const cid = await this.client.put([blob], { name: file.name });
    return cid;
  }
}

module.exports = Web3StorageService;
