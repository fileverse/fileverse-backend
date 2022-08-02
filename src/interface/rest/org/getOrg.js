const { Org } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getOrgValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrg(req, res) {
  const { address } = req.params;
  const org = await Org.getByAddress(address);
  res.json(org);
}

module.exports = [validate(getOrgValidation), getOrg];
