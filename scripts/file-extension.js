/* eslint-disable no-process-exit */
const { File } = require('../src/infra/database/models');
const { fromBuffer } = require('file-type');
const axios = require('axios');

class Script {
  static async run() {
    const fileCount = await File.count();
    var enc = new TextEncoder();
    for (let i = 0; i < fileCount; i++) {
      const foundFiles = await File.find().sort({ _id: -1 }).skip(i).limit(1);
      const file = foundFiles[0];
      console.log('checking...', file.name, file.extension);
      if (file.extension === undefined) {
        try {
          const fileData = await axios.get(file.url);
          const fileType = await fromBuffer(enc.encode(fileData.data));
          if (fileType) {
            const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
            await File.updateOne(
              { uuid: file.uuid },
              { name: fileName, extension: fileType.ext },
            );
          }
        } catch (err) {
          //console.log(err);
        }
      }
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
