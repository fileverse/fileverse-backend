const _errorHandler = {};

_errorHandler.formatGQLError = function (err) {
  const { req = {} } = err.originalError || {};
  const responseData = {
    requestId: req.requestId,
    message: err.message,
    authUser: req.authUser,
    success: false,
    code: (err.originalError && err.originalError.code) || 500,
    locations: err.locations,
    path: err.path,
  };
  return responseData;
};

_errorHandler.throwError = ({ code = 500, message, req = {} }) => {
  const error = new Error(message);
  error.code = code;
  error.req = req;
  error.authUser = req.authUser;
  throw error;
};

module.exports = _errorHandler;
