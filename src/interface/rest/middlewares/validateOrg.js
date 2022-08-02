const Org = require('../../../domain/org');

function validateOrg(req, res, next) {
  const { subdomain } = req.processedHeaders || {};
  if (subdomain) {
    Org.get(subdomain).then((org) => {
      if (!org) {
        const statusCode = 404;
        return res.status(statusCode).json({
          message: `This org doesn't exist: ${subdomain}`,
          requestId: req.requestId,
        });
      }
      req.subdomain = subdomain.toLowerCase();
      req.org = org;
      next();
    });
  } else {
    next();
  }
}

module.exports = validateOrg;
