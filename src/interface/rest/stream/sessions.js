const { Stream } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  params: Joi.object({
    streamId: Joi.string().required(),
  }),
};

async function sessions(req, res) {
  const { streamId } = req.params;
  const streamResult = await Stream.sessions(streamId);
  res.json(streamResult);
}

module.exports = [validate(createValidation), sessions];
