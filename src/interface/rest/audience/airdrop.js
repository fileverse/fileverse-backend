const { Audience } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const airdropValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
  }),
};

async function airdrop(req, res) {
  const { uuid } = req.params;
  const { name, symbol } = req.body;
  const foundAudience = await Audience.airdrop({ uuid, name, symbol });
  res.json({ audience: foundAudience, token: null });
}

module.exports = [validate(airdropValidation), airdrop];
