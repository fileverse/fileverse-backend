const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function create(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = [validate(createValidation), create];
