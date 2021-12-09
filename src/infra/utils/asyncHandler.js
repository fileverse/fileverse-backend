const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const asyncHandlerArray = (resolvers) => {
  return resolvers.map(
    (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next),
  );
};

module.exports = { asyncHandler, asyncHandlerArray };
