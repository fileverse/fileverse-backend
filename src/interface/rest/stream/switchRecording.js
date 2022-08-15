const { Stream } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  params: Joi.object({
    streamId: Joi.string().required(),
  }),
  body: Joi.object({
    record: Joi.string().required(),
    ownerAddress: Joi.string().required(),
  }),
};

async function switchRecording(req, res) {
  const { streamId } = req.params;
  const { record, ownerAddress } = req.body;

  const result = await Stream.switchRecording({
    streamId,
    ownerAddress,
    reqAddress: req.address,
    record: record === 'true',
  });

  res.status(204).json(result);
}

module.exports = [validate(createValidation), switchRecording];
