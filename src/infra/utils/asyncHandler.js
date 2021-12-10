const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const asyncHandlerArray = (resolvers) => {
  return resolvers.map(asyncHandler);
};

module.exports = { asyncHandler, asyncHandlerArray };
