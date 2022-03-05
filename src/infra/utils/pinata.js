const config = require('../../../config');
const pinataSDK = require('@pinata/sdk');

class Pinata {
  constructor() {
    this.apiKey = config.PINATA_API_KEY;
    this.secretApiKey = config.PINATA_SECRET_KEY;
    this.pinata = pinataSDK(this.apiKey, this.secretApiKey);
  }

  formatFile(file) {
    return {
      ipfsUrl: `https://ipfs.fileverse.io/ipfs/${file.IpfsHash}`,
      ipfsHash: file.IpfsHash,
      pinSize: file.PinSize,
      timestamp: file.Timestamp,
    };
  }

  async upload(readableStreamForFile, { name, attributes }) {
    const keyvalues = {};
    (attributes || []).forEach((attribute) => {
      keyvalues[attribute.trait_type] = attribute.value;
    });
    const options = {
      pinataMetadata: {
        name,
        keyvalues,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };
    const file = await this.pinata.pinFileToIPFS(
      readableStreamForFile,
      options,
    );
    return this.formatFile(file);
  }

  async get({ ipfsUrl }) {
    if (!ipfsUrl) {
      return null;
    }
    return ipfsUrl;
  }
}

module.exports = Pinata;
