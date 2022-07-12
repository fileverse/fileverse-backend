const { validator } = require('../middlewares');
const { Joi, validate } = validator;
const mocksOrgs = require('./org.json');

const getOrgValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrg(req, res) {
  const { address } = req.body;
  const org = mocksOrgs[0];
  org.address = address;
  res.json(org);
}

module.exports = [validate(getOrgValidation), getOrg];
