const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const addAvatarValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function addAvatar(req, res) {
  const { userId, address } = req;

  const imgLink = await User.addAvatar({
    userId,
    address,
    image: req.files.image,
  });
  console.log(imgLink);
  res.json(imgLink);
}

module.exports = [validate(addAvatarValidation), addAvatar];
