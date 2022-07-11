const { Log } = require('../../infra/database/models');

async function getEventInfo(eventName) {
  const total = await Log.find({ eventName }).count();
  const lastWeekTotal = await Log.aggregate([
    {
      $match: {
        eventName,
        $expr: {
          $lt: [
            '$timeStamp',
            { $dateSubtract: { startDate: '$$NOW', unit: 'day', amount: 0 } },
          ],
        },
      },
    },
    {
      $count: 'lastWeekCount',
    },
  ]);
  const changeFromLastWeek = lastWeekTotal[0]
    ? total - lastWeekTotal[0].lastWeekCount
    : '0';
  return { total, changeFromLastWeek };
}

async function analytics(address) {
  const visits = await getEventInfo('view');
  const downloads = await getEventInfo('download');
  return { address, visits, downloads };
}

module.exports = analytics;
