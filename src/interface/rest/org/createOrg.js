const { validator } = require('../middlewares');
const { Joi, validate } = validator;
const { Org } = require('../../../domain');

const createOrgValidation = {
  body: Joi.object({
    subdomain: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().optional(),
  }),
};

async function createOrg(req, res) {
  const { subdomain, name, description } = req.body;
  const org = await Org.create({ subdomain, name, description });
  res.json(org);
}

module.exports = [validate(createOrgValidation), createOrg];
