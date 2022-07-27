/* eslint-disable no-process-exit */
const { Audience, File } = require('../src/infra/database/models');

class Script {
  static async run() {
    const batchSize = 10;
    const totalAud = await Audience.count();
    const totalBatch = Math.floor((totalAud + batchSize - 1) / batchSize);
    for (let i = 0; i < totalBatch; i++) {
      const batch = await Audience.find()
        .skip(i * batchSize)
        .limit(batchSize);
      await Promise.all(
        batch.map(async (aud) => {
          const file = await File.findOne({ uuid: aud.fileUuid });
          if (file === null) {
            console.log('unsetting: ', aud.fileUuid);
            await Audience.updateMany(
              { fileUuid: aud.fileUuid },
              { $unset: { fileUuid: '' } },
            );
          }
        }),
      );
    }
  }
}

(async () => {
  try {
    console.log('Script run started!');
    await Script.run();
    console.log('Script run complete!');
    process.exit(0);
  } catch (err) {
    console.log(err.stack);
    process.exit(1);
  }
})();
