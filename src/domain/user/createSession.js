const { Session } = require('../../infra/database/models');

async function createSession({ address, userId, subdomain }) {
  const sessionContent = { address, userId };
  if (subdomain) {
    sessionContent.subdomain = subdomain.toLowerCase();
  }
  const createdSession = await new Session(sessionContent).save();
  return createdSession._id;
}

module.exports = createSession;
