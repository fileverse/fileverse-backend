async function canCreateFile(req, res, next) {
  console.log('the response will be sent by the next function ...');
  next();
}

module.exports = canCreateFile;
