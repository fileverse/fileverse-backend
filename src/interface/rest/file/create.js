const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    slug: Joi.string().optional(),
    description: Joi.string().optional().max(500),
  }),
};

async function create(req, res) {
  const { name, slug, description } = req.body;
  const createdFile = await File.create({
    file: req.files.file,
    name,
    description,
    owner: req.userId,
    slug,
  });
  res.json(createdFile);
}

module.exports = [validate(createValidation), create];
