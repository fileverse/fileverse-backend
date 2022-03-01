const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const editValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().optional().allow(''),
  }),
};

async function edit(req, res) {
  const { uuid } = req.params;
  const { name } = req.body;
  const updatedFile = await File.edit(uuid, {
    file: req.files && req.files.file,
    name,
  });
  res.json(updatedFile);
}

module.exports = [validate(editValidation), edit];
