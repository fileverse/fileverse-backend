'use strict';
const pinataSDK = require('@pinata/sdk');

class Pinata {
  constructor(apiKey, secretApiKey) {
    this.apiKey = apiKey;
    this.secretApiKey = secretApiKey;
    this.pinata = pinataSDK(this.apiKey, this.secretApiKey);
  }

  format_pinFileToIPFS(file) {
    return {
      ipfsHash: file.IpfsHash,
      pinSize: file.PinSize,
      fileLink: `https://ipfs.fileverse.io/ipfs/${file.IpfsHash}`,
      timestamp: file.Timestamp,
    };
  }

  async pinFileToIPFS(readableStreamForFile, { name, attributes }) {
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
    return this.format_pinFileToIPFS(file);
  }
}

module.exports = Pinata;
