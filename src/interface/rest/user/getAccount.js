const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getAccount(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = [validate(getAccountValidation), getAccount];
