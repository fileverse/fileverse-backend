const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    file: Joi.any().required(),
  }),
};

async function create(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = [validate(createValidation), create];
