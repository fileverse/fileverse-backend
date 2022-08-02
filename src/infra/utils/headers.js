class Header {
  constructor() {}

  process(req, res, next) {
    let token = req.headers['authorization'];
    if (token && token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    const subdomain = req.headers['x-app-subdomain'];
    const recaptchaToken = req.headers['recaptchatoken'];
    const processedHeaders = {
      token: token || null,
      subdomain: (subdomain && subdomain.toLowerCase()) || null,
      recaptchaToken: recaptchaToken || null,
    };
    req.processedHeaders = processedHeaders;
    next();
  }
}

module.exports = Header;
