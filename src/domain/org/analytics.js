const { Analytics } = require('../../infra/database/models');

async function analytics(address) {
  const visits = await Analytics.aggregate([
    {
      $match: {
        $expr: {
          $gt: [
            '$timeStamp',
            { $dateSubtract: { startDate: '$$NOW', unit: 'week', amount: 1 } },
          ],
        },
        eventName: 'view',
      },
    },
  ]).count();

  return { address, dataSet: visits };
}

module.exports = analytics;
