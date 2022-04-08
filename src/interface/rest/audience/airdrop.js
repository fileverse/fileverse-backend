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
  const foundAudience = await Audience.get(uuid);
  res.json(foundAudience);
}

module.exports = [validate(airdropValidation), airdrop];
