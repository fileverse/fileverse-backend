const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getTokensByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getTokensByAccount(req, res) {
  const { address } = req.params;
  const { search, chain } = req.query;
  const tokens = await User.getTokens(address, search || '', chain || 'eth');
  res.json({ token: tokens });
}

module.exports = [validate(getTokensByAccountValidation), getTokensByAccount];
