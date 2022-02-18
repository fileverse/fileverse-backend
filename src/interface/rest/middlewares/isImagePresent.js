const ErrorHandler = require('../../../infra/utils/errorHandler');

function isImagePresent(req, res, next) {
  if (!req.files || !req.files.image) {
    return ErrorHandler.throwError({
      code: 403,
      message: 'Image not present',
    });
  }
  next();
}

module.exports = isImagePresent;
