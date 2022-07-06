const { validator } = require('../middlewares');
const { Joi, validate } = validator;
const mocksOrgs = require('./org.json');

const createOrgValidation = {
  body: Joi.object({
    address: Joi.string().required(),
  }),
};

async function createOrg(req, res) {
  const { address } = req.body;
  const org = mocksOrgs[0];
  org.address = address;
  res.json(org);
}

module.exports = [validate(createOrgValidation), createOrg];
