const axios = require('axios');
const ErrorHandler = require('../../../infra/utils/errorHandler');

async function validateRecaptcha(req, res, next) {
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
  const recaptchaToken = req.headers['recaptchatoken'];
  if (!recaptchaToken)
    return ErrorHandler.throwError({
      code: 404,
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
    data.action === 'file'
  ) {
    next();
  } else {
    return ErrorHandler.throwError({
      code: 401,
      message: `RecaptchValidation Failed`,
      req,
    });
  }
}

module.exports = validateRecaptcha;
