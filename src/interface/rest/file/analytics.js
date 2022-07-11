const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const analyticsValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function analytics(req, res) {
  const { uuid } = req.params;
  // TODO: Subdomain Support
  res.json(await File.analytics(uuid));
}

module.exports = [validate(analyticsValidation), analytics];
