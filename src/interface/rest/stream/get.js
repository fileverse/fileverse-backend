const { Stream } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  params: Joi.object({
    streamId: Joi.string().required(),
  }),
  query: Joi.object({
    ownerAddress: Joi.string().optional(),
  }),
};

async function get(req, res) {
  const { streamId } = req.params;
  const { ownerAddress } = req.query;
  const streamResult = await Stream.get({
    streamId,
    ownerAddress,
    reqAddress: req.address,
  });
  res.json(streamResult);
}

module.exports = [validate(createValidation), get];
