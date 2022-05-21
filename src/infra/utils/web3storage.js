const { Web3Storage } = require('web3.storage');
const config = require('./../../../config');

class Web3StorageService {
  constructor() {
    this.client = new Web3Storage({ token: config.WEB3STORAGE_TOKEN });
  }

  async upload(readableStreamForFile, name) {
    const cid = await this.client.put([
      { name, stream: () => readableStreamForFile },
    ]);
    console.log({ cid });
    if (!cid) return null;
    return {
      ipfsUrl: `https://ipfs.io/ipfs/${cid}/${name}`,
      ipfsHash: cid,
    };
  }

  // need to figure out
  async retrieve(cid) {
    const res = await this.client.get(cid);
    if (!res.ok) {
      throw new Error(`failed to get ${cid}`);
    }

    const files = await res.files();
    for (const file of files) {
      console.log(`${file.cid} -- ${file.path} -- ${file.size}`);
      console.log(file);
    }
  }
}

module.exports = Web3StorageService;
