const config = require('../../../config');
const axios = require('axios');

class OpenSea {
  constructor() {
    this.url = '';
  }

  static formatNFT(nft, chain) {
    const nftObject = {
      contractAddress: nft.asset_contract && nft.asset_contract.address,
      name: nft.asset_contract && nft.asset_contract.name,
      image: nft.image_url,
      symbol: nft.asset_contract && nft.asset_contract.symbol,
      chain,
    };
    return nftObject;
  }

  getOwnedNFTs(address, { offset }) {
    return axios
      .get(`https://${config.OPENSEA_ENV}.opensea.io/api/v1/assets`, {
        params: {
          owner: address,
          offset,
          limit: 20,
          order_direction: 'desc',
        },
      })
      .then(function (response) {
        // handle success
        return response.data;
      })
      .then(function ({ assets }) {
        const data = {
          assets: assets.map((elem) => OpenSea.formatNFT(elem)),
          pageSize: 20,
          pageNo: parseInt(offset / 20, 10) + 1,
          total: offset + assets.length,
        };
        return data;
      });
  }
}

module.exports = OpenSea;
