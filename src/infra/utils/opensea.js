const config = require('../../../config');
const axios = require('axios');

class OpenSea {
  constructor() {
    // this.api = sdk;
  }

  static formatNFT(nft) {
    const nftObject = {
      contractAddress: nft.asset_contract && nft.asset_contract.address,
      tokenId: nft.token_id,
      name: nft.name,
      description: nft.description,
      image: nft.image_url,
      owner: nft.owner && nft.owner.address,
    };
    return nftObject;
  }

  getNFTs(address, { offset }) {
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
