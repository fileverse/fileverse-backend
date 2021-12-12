const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function get(req, res) {
  const { uuid } = req.params;
  const file = await File.get(uuid);
  res.json(file);
}

module.exports = [validate(getValidation), get];
