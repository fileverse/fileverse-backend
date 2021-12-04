let jwt = require('jsonwebtoken');

class Encryption {
  constructor(secret) {
    this.jwtSecret = secret;
  }

  async signToken(data) {
    let token = jwt.sign(data, this.jwtSecret, {
      expiresIn: '24h',
    });
    return token;
  }

  async verifyToken(token) {
    // Assign jwt token
    const secret = this.jwtSecret;
    console.log('Secret: ', secret);
    return jwt.verify(token, secret);
  }

  async verifyAccessToken(token) {
    return { server: token };
  }

  static async validateAccessToken(token, secret) {
    return secret === token;
  }
}

module.exports = Encryption;
