const { Audience } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    inputType: Joi.string().valid('csv', 'list').optional().default('csv'),
    addressList: Joi.array().items(Joi.string()).optional(),
  }),
};

async function create(req, res) {
  const { address } = req;
  const { addressList } = req.body;
  const result = await Audience.create(
    address,
    req.files && req.files.file,
    addressList,
  );
  res.json(result);
}

module.exports = [validate(createValidation), create];
