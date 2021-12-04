async function canViewAccount(req, res, next) {
  console.log('the response will be sent by the next function ...');
  next();
}

module.exports = canViewAccount;
