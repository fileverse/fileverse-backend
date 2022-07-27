const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getAccount(req, res) {
  const { address } = req.params;
  // TODO: Subdomain Support
  const account = await User.getAccount({ address: address.toLowerCase() });
  res.json(account);
}

module.exports = [validate(getAccountValidation), getAccount];
