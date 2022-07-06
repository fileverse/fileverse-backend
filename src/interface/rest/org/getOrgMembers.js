const { validator } = require('../middlewares');
const { Joi, validate } = validator;
const mocksOrgs = require('./org.json');

const getOrgMembersValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrgMembers(req, res) {
  const { address } = req.body;
  const org = mocksOrgs[0];
  org.address = address;
  res.json({
    members: org.members,
    total: org.members.length,
    matching: org.members.length,
  });
}

module.exports = [validate(getOrgMembersValidation), getOrgMembers];
