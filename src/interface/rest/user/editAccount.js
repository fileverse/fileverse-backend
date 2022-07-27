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
    description: Joi.string().optional().allow('').max(200),
  }),
};

async function editAccount(req, res) {
  const { username, name, email, description } = req.body;
  // TODO: Subdomain Support
  const account = await User.editAccount(req.userId, {
    username,
    name,
    email,
    description,
  });
  res.json(account);
}

module.exports = [validate(editAccountValidation), editAccount];
