const { Feedback } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    url: Joi.string().required(),
    comment: Joi.string().required(),
    address: Joi.string().optional(),
  }),
};

async function create(req, res) {
  const { url, comment } = req.body;
  const createdData = await Feedback.create({
    url,
    comment,
    address: req.address,
  });
  res.json(createdData);
}

module.exports = [validate(createValidation), create];
