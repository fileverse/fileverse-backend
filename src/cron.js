const config = require('../config');
const agenda = require('./interface/cron');

async function graceful() {
  await agenda.stop();
  // eslint-disable-next-line no-process-exit
  process.exit(0);
}

(async function () {
  try {
    await agenda.start();
    let crons = [];
    for (let job of crons) {
      await job.activate();
    }
    require('./interface/cron/events/deployErc721Contract');
    require('./interface/cron/events/mintErc721Token');
    require('./interface/cron/events/transferErc721Contract');
    console.log('started cron job successfully');
    console.log(config);
  } catch (err) {
    console.log(err.stack);
    await graceful();
  }
})();

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
