const { User } = require('../../../domain');
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
  const { address } = req.params;
  const { message, signature } = req.body;
  const { token } = await User.login({ message, signature, address });
  res.json({ token });
}

module.exports = [validate(loginValidation), login];
