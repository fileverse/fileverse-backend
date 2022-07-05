const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getOrgMembersValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrgMembers(req, res) {
  const { address } = req.params;
  res.json({ address });
}

module.exports = [validate(getOrgMembersValidation), getOrgMembers];
