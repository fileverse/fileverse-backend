const { ValidationError } = require('./validator');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.log(err);
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
}

module.exports = errorHandler;
