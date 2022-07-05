const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const archiveOrgValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function archiveOrg(req, res) {
  const { address } = req.params;
  res.json({ address });
}

module.exports = [validate(archiveOrgValidation), archiveOrg];
