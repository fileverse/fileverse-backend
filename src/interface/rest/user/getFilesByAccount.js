const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getFilesByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getFilesByAccount(req, res) {
  console.log('the response will be sent by the next function ...');
  res.json({ hello: true });
}

module.exports = [validate(getFilesByAccountValidation), getFilesByAccount];
