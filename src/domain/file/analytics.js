const ErrorHandler = require('../../infra/utils/errorHandler');
const { File, Log } = require('../../infra/database/models');

async function analytics(uuid) {
  const foundFile = await File.findOne({ $or: [{ uuid }, { slug: uuid }] });
  if (!foundFile) {
    return ErrorHandler.throwError({
      code: 404,
      message: 'Cannot find the file by this uuid',
    });
  }
  const res = await Log.aggregate([
    {
      $match: {
        fileUuid: uuid,
        $expr: {
          $gt: [
            '$timeStamp',
            { $dateSubtract: { startDate: '$$NOW', unit: 'week', amount: 1 } },
          ],
        },
      },
    },
    {
      $group: {
        _id: {
          time: { $dateToString: { format: '%Y-%m-%d', date: '$timeStamp' } },
          eventName: '$eventName',
        },
        eventName: { $first: '$eventName' },
        count: { $sum: 1 },
        dateLabel: {
          $first: {
            $dateToString: { format: '%Y-%m-%d', date: '$timeStamp' },
          },
        },
        timeStamp: {
          $first: { $subtract: ['$timeStamp', new Date('1970-01-01')] },
        },
      },
    },
    { $sort: { timeStamp: 1 } },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  return { fileUuid: uuid, dataPoints: res };
}

module.exports = analytics;
