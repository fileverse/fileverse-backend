const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const loginValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  body: Joi.object({
    signature: Joi.string().required(),
    message: Joi.string().required(),
  }),
};

async function login(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = [validate(loginValidation), login];
