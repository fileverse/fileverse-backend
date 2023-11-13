const axios = require('axios');
const crypto = require('crypto');
const ErrorHandler = require('../../../infra/utils/errorHandler');

const _isValidApiKey = (clientApiKey) => {
  const apiKey = process.env.API_KEY;
  if (!clientApiKey || clientApiKey.length !== apiKey.length) {
    return false;
  } else {
    // compare keys in constant time to prevent potential timing attack
    return crypto.timingSafeEqual(
      Buffer.from(clientApiKey),
      Buffer.from(apiKey),
    );
  }
};

async function validateRecaptcha(req, res, next) {
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaToken = req.headers['recaptchatoken'];
  const clientApiKey = req.headers['x-api-key'];
  const isValidApiKey = _isValidApiKey(clientApiKey);
  if (isValidApiKey) {
    next();
    return;
  } else {
    if (!recaptchaToken)
      return ErrorHandler.throwError({
        code: 401,
        message: `Recaptcha Token Missing`,
        req,
      });
    const url = `https://www.recaptcha.net/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
    const threshold = 0.5;
    const { data } = await axios.post(url);
    if (
      data.success &&
      data.score &&
      data.action &&
      data.score >= threshold &&
      (data.action === 'file' ||
        data.action === 'lock' ||
        data.action === 'edit')
    ) {
      next();
    } else {
      return ErrorHandler.throwError({
        code: 429,
        message: `Too Many Requests`,
        req,
      });
    }
  }
}

module.exports = validateRecaptcha;
