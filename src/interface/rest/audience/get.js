const { Audience } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function get(req, res) {
  const { uuid } = req.params;
  // TODO: Subdomain Support
  const foundAudience = await Audience.get(uuid);
  res.json(foundAudience);
}

module.exports = [validate(getValidation), get];
