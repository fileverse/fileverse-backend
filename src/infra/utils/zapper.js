const config = require('../../../config');
const axios = require('axios');

class ZapperService {
  constructor() {
    this.baseUrl = 'https://api.zapper.fi/v1/apps/tokens/balances';
    this.apiKey = config.ZAPPER_API_KEY;
  }

  formatToken(token, chain) {
    const name =
      (token && token.displayProps && token.displayProps.label) || '';
    const images =
      (token && token.displayProps && token.displayProps.images) || [];
    const thumbnail = images.shift();
    return {
      contractAddress: token.address,
      name,
      symbol: token.symbol,
      thumbnail,
      chain,
    };
  }

  async getOwnedTokens(address, chain = 'ethereum') {
    const options = {
      api_key: this.apiKey,
    };
    const apiResponse = await axios.get(
      `${this.baseUrl}?addresses[]=${address}&network=${chain}`,
      options,
    );
    // eslint-disable-next-line security/detect-object-injection
    const products = apiResponse.data.balances[address.toLowerCase()].products;
    const tokenProduct = products.find((elem) => elem.label === 'Tokens');
    const tokens =
      (tokenProduct &&
        tokenProduct.assets.map((token) => this.formatToken(token, chain))) ||
      [];
    return tokens.filter(
      (token) =>
        token.name &&
        token.symbol &&
        token.contractAddress !== '0x0000000000000000000000000000000000000000',
    );
  }
}

module.exports = ZapperService;
