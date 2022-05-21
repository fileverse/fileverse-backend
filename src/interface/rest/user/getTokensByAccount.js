const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getTokensByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  query: Joi.object({
    search: Joi.string().optional(),
    chain: Joi.string().valid('ethereum', 'polygon', 'rinkeby').optional(),
  }),
};

async function getTokensByAccount(req, res) {
  const { address } = req.params;
  const { search = '', chain } = req.query;
  const tokens = await User.getTokens({ address, search, chain });
  res.json({ token: tokens });
}

module.exports = [validate(getTokensByAccountValidation), getTokensByAccount];
