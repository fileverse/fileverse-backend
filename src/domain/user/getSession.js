const { Session } = require('../../infra/database/models');

async function getSession({ sessionId }) {
  const session = await Session.findOne({ _id: sessionId }).lean();
  return session || {};
}

module.exports = getSession;
