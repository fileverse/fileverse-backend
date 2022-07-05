const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getOrgValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrg(req, res) {
  const { address } = req.params;
  res.json({ address });
}

module.exports = [validate(getOrgValidation), getOrg];
