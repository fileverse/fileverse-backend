const Encryption = require('./encryption');
const config = require('../../../config');
const { v4: uuidv4 } = require('uuid');
const encryption = new Encryption(config.JWT_SECRET);

let verifyToken = (req, res, next) => {
  req.requestId = uuidv4();
  console.log('req.requestId: ', req.requestId);
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token && token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  req.isAuthenticated = false;
  if (token) {
    encryption
      .verifyToken(token)
      .then((decoded) => {
        req.userId = decoded.userId;
        req.address = decoded.address;
        req.account = decoded;
        req.isAuthenticated = true;
        next();
      })
      .catch((err) => {
        console.log(err);
        return res.status(401).json({
          message: 'Token is not valid',
        });
      });
  } else {
    next();
  }
};

module.exports = {
  verifyToken,
};
