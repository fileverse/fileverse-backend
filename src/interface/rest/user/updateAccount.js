const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const updateAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  body: Joi.object({
    username: Joi.string().optional(),
    name: Joi.string().optional().allow(''),
    email: Joi.string().optional().allow(''),
  }),
};

async function updateAccount(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = [validate(updateAccountValidation), updateAccount];
