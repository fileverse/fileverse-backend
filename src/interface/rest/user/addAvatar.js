const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const addAvatarValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function addAvatar(req, res) {
  const { userId } = req;
  const { address } = req.params;
  // TODO: Subdomain Support
  const imgLink = await User.addAvatar({
    userId,
    address,
    image: req.files.image,
  });
  res.json(imgLink);
}

module.exports = [validate(addAvatarValidation), addAvatar];
