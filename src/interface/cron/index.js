const config = require('../../../config');
const Agenda = require('agenda');

const cron = new Agenda({
  db: {
    address: config.MONGOURI,
  },
  defaultConcurrency: config.AGENDA_DEFAULT_CONCURRENCY || 1,
  defaultLockLimit: config.AGENDA_DEFAULT_CONCURRENCY || 1,
});

module.exports = cron;
