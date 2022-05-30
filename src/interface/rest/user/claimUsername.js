const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const claimUsernameValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  body: Joi.object({
    signature: Joi.string().required(),
    message: Joi.string().required(),
    username: Joi.string().required().min(5),
  }),
};

async function claimUsername(req, res) {
  const { address } = req.params;
  const { message, signature, username } = req.body;
  await User.usernameExists({ username });
  const { token, userId } =
    (await User.login({
      message,
      signature,
      address: address.toLowerCase(),
    })) || {};
  if (token && userId) {
    await User.editAccount(userId, { username });
  }
  res.json({ token });
}

module.exports = [validate(claimUsernameValidation), claimUsername];
