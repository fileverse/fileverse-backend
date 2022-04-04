const { Web3Storage, File } = require('web3.storage');
const config = require('./../../../config');

class Web3StorageService {
  constructor() {
    console.log({ token: config.WEB3STORAGE_TOKEN });
    this.client = new Web3Storage({ token: config.WEB3STORAGE_TOKEN });
  }

  async getCid(data, name, mimetype, uuid) {
    let blob = new File([data], uuid, { type: mimetype });
    const cid = await this.client.put([blob], { name: uuid });
    console.log('\n\n', { cid });
  }

  async upload(readableStreamForFile, { name, mimetype, uuid }) {
    return new Promise((resolve, reject) => {
      let data = '';
      let chunk;

      readableStreamForFile.on('readable', () => {
        while ((chunk = readableStreamForFile.read()) != null) {
          data += chunk;
        }
      });

      readableStreamForFile.on('end', async () => {
        const web3 = new Web3StorageService();
        const cid = await web3.getCid(data, name, mimetype, uuid);
        resolve(cid);
      });

      readableStreamForFile.on('error', () => {
        reject(null);
      });
    });
  }

  async retrieve(cid) {
    const res = await this.client.get(cid);
    console.log(`Got a response! [${res.status}] ${res.statusText}`);
    console.log(res);
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
