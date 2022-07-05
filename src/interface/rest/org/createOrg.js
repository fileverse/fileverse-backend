const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createOrgValidation = {
  body: Joi.object({
    address: Joi.string().required(),
  }),
};

async function createOrg(req, res) {
  const { address } = req.body;
  res.json({ address });
}

module.exports = [validate(createOrgValidation), createOrg];
