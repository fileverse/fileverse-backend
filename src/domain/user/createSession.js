const { Session } = require('../../infra/database/models');

async function createSession({ address, userId }) {
  const createdSession = await new Session({ address, userId }).save();
  return createdSession._id;
}

module.exports = createSession;
