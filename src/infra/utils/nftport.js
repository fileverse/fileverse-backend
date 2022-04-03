const config = require('../../../config');
const axios = require('axios');
const _ = require('lodash');

class NFTPortService {
  constructor() {
    this.baseUrl = 'https://api.nftport.xyz/v0/accounts';
    this.apiKey = config.NFTPORT_API_KEY;
  }

  formatNFT(nft, chain) {
    return {
      contractAddress: nft.contract_address,
      name: nft.name,
      image: nft.cached_file_url || nft.file_url,
      symbol: nft.name,
      chain,
    };
  }

  async getOwnedNFTs(address, chain = 'ethereum') {
    const options = {
      headers: { Authorization: this.apiKey },
    };
    const apiResponse = await axios.get(
      `${this.baseUrl}/${address}?chain=${chain}&page_size=50&include=metadata`,
      options,
    );
    // eslint-disable-next-line security/detect-object-injection
    const rawNFTs = apiResponse.data && apiResponse.data.nfts;
    const nfts = rawNFTs.map((nft) => this.formatNFT(nft, chain));
    const filteredNFTs = nfts.filter((token) => token.name && token.symbol);
    const contracts = _.uniqBy(filteredNFTs, 'contractAddress');
    const contractAPIResponse = await axios.get(
      `${this.baseUrl}/${address}?chain=${chain}&page_size=50&include=contract_information`,
      options,
    );
    // eslint-disable-next-line security/detect-object-injection
    const rawNFTsWithContract =
      contractAPIResponse.data && contractAPIResponse.data.nfts;
    return contracts.map((contractElem) => {
      const contractInfo = rawNFTsWithContract.find(
        (elem) => elem.contract_address === contractElem.contractAddress,
      );
      contractElem.name =
        (contractInfo.contract && contractInfo.contract.name) ||
        contractElem.name;
      contractElem.symbol =
        (contractInfo.contract && contractInfo.contract.symbol) ||
        contractElem.symbol;
      return contractElem;
    });
  }
}

module.exports = NFTPortService;
