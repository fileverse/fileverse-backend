const { validator } = require('../middlewares');
const { Joi, validate } = validator;
const mocksOrgs = require('./org.json');

const editOrgValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function editOrg(req, res) {
  const { address } = req.params;
  const org = mocksOrgs[0];
  org.address = address;
  res.json(org);
}

module.exports = [validate(editOrgValidation), editOrg];
