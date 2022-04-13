const config = require('../../../config');
const Agenda = require('agenda');

const cron = new Agenda({
  db: {
    address: config.MONGOURI,
  },
});

module.exports = cron;
