const { Audience } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getAirdropValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getAirdrops(req, res) {
  const { address } = req.params;
  const audiences = await Audience.getByAddress(address.toLowerCase());
  res.json({ audienceList: audiences });
}

module.exports = [validate(getAirdropValidation), getAirdrops];
