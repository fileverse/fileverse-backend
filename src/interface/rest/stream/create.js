const { Stream } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    name: Joi.string().required(),
  }),
};

async function create(req, res) {
  const { name } = req.body;
  const streamResult = await Stream.create(name);
  res.json(streamResult);
}

module.exports = [validate(createValidation), create];
