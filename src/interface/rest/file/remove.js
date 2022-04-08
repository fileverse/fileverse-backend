const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const removeValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function remove(req, res) {
  const { uuid } = req.params;
  const result = await File.remove(uuid);
  res.json(result);
}

module.exports = [validate(removeValidation), remove];
