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
  const subdomain = req.subdomain;
  const createdFile = await File.create({
    file: req.files && req.files.file,
    name,
    description,
    owner: req.userId,
    slug,
    subdomain,
  });
  res.json(createdFile);
}

module.exports = [validate(createValidation), create];
