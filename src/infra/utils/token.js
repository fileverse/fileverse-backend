const Zapper = require('./zapper');
const Moralis = require('./moralis');

const moralisInstance = new Moralis();
const zapperInstance = new Zapper();

class Token {
  constructor() {}

  async getOwnedTokens({ chain, address }) {
    if (chain === 'rinkeby' || chain === 'ethereum' || chain === 'polygon') {
      return moralisInstance.getOwnedTokens(address, chain);
    } else {
      return zapperInstance.getOwnedTokens(address, chain);
    }
  }
}

module.exports = Token;
