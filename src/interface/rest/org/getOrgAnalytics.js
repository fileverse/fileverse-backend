const { Organization } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getOrgAnalyticsValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrgAnalytics(req, res) {
  const { address } = req.params;
  res.json(await Organization.analytics(address));
}

module.exports = [validate(getOrgAnalyticsValidation), getOrgAnalytics];
