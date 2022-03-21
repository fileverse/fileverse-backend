const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getTokensByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  query: Joi.object({
    search: Joi.string().optional(),
  }),
};

async function getTokensByAccount(req, res) {
  const { address } = req.params;
  const { search = '' } = req.query;
  const tokens = await User.getTokens({ address, search });
  res.json({ token: tokens });
}

module.exports = [validate(getTokensByAccountValidation), getTokensByAccount];
