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
}

module.exports = Encryption;
