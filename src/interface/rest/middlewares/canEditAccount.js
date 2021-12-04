async function canEditAccount(req, res, next) {
  console.log('the response will be sent by the next function ...');
  next();
}

module.exports = canEditAccount;
