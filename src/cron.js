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
    require('./interface/cron/events/mintOGSupporterToken');
    console.log('started cron job successfully');
  } catch (err) {
    console.log(err.stack);
    await graceful();
  }
})();

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);
