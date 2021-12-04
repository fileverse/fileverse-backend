const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const updateValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function update(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = [validate(updateValidation), update];
