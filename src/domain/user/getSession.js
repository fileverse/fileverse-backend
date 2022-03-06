const { Session } = require('../../infra/database/models');

async function getSession({ sessionId }) {
  const session = await Session.findOne({ sessionId }).lean();
  return session || {};
}

module.exports = getSession;
