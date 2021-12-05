const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const updateValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().optional().allow(''),
    file: Joi.any().required(),
  }),
};

async function update(req, res) {
  const { uuid } = req.params;
  const { file, name } = req.body;
  const updatedFile = await File.update(uuid, {
    file,
    name,
  });
  res.json(updatedFile);
}

module.exports = [validate(updateValidation), update];
