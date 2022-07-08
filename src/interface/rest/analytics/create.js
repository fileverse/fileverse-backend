const { Analytics } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    eventName: Joi.string().required(),
    fileUuid: Joi.string().required(),
  }),
};

async function create(req, res) {
  const { eventName, fileUuid } = req.body;
  const createdData = await Analytics.create(eventName, fileUuid);
  res.json(createdData);
}

module.exports = [validate(createValidation), create];
