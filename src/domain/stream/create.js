const Livepeer = require('../../infra/utils/livepeer');
const livepeerInstance = new Livepeer();

async function create(name) {
  const stream = await livepeerInstance.createStream({ name });
  return stream;
}

module.exports = create;
