const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const editAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  body: Joi.object({
    username: Joi.string().optional(),
    name: Joi.string().optional().allow(''),
    email: Joi.string().optional().allow(''),
  }),
};

async function editAccount(req, res) {
  const { username, name, email } = req.body;
  const account = await User.editAccount(req.userId, {
    username,
    name,
    email,
  });
  res.json(account);
}

module.exports = [validate(editAccountValidation), editAccount];
