const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
  path: path.resolve(
    __dirname,
    `./${process.env.NODE_ENV ? process.env.NODE_ENV : ''}.env`,
  ),
});
const config = process.env;
config.SERVICE_NAME = config.SERVICE_NAME || 'template-service';
module.exports = config;
