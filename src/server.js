const config = require('../config');
const logger = require('./infra/utils/logger');

const app = require('./app');

// Here you set the PORT and IP of the server
const port = config.PORT || 8001;
const ip = config.IP || '127.0.0.1';

app.listen({ port, ip }, () =>
  logger.info(`🚀 Server ready at http://${ip}:${port}`),
);

module.exports = app;
