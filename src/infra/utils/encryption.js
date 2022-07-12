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
    return jwt.verify(token, secret);
  }

  static getEncryptionContextFromFile({ subdomain, uuid } = {}) {
    let context = null;
    if (subdomain) {
      context = {
        subdomain,
        uuid,
      };
    }
    return context;
  }
}

module.exports = Encryption;
