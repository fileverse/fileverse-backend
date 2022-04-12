const { Audience } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    inputType: Joi.string()
      .valid('csv', 'addressList')
      .optional()
      .default('csv'),
    addressList: Joi.array().items(Joi.string()).optional(),
  }),
};

async function create(req, res) {
  const { address } = req;
  const { addressList, inputType } = req.body;
  const result = await Audience.create({
    owner: address,
    csv: req.files && req.files.file,
    addressList,
    inputType,
  });
  res.json(result);
}

module.exports = [validate(createValidation), create];
