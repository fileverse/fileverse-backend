const { Feedback } = require('../../infra/database/models');

async function create({ url, address, comment }) {
  const feedback = await new Feedback({ url, address, comment }).save();
  return feedback.safeObject();
}

module.exports = create;
