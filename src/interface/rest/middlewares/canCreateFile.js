async function canCreateFile(req, res, next) {
  console.log(req);
  next();
}

module.exports = canCreateFile;
