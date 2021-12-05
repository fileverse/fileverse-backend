const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

async function create(req, res) {
  console.log(req.body);
  const { name } = req.body;
  const createdFile = await File.create({
    file: req.files.file,
    name,
    owner: res.userId,
  });
  res.json(createdFile);
}

module.exports = [validate(createValidation), create];
