const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    file: Joi.any().required(),
  }),
};

async function create(req, res) {
  const { file, name } = req.body;
  const createdFile = await File.create({
    file,
    name,
    owner: res.userId,
  });
  res.json(createdFile);
}

module.exports = [validate(createValidation), create];
