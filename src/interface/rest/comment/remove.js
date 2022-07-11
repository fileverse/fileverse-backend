const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const removeValidation = {
  params: Joi.object({
    shortId: Joi.string().required(),
    uuid: Joi.string().required(),
  }),
};

async function remove(req, res) {
  const { shortId, uuid } = req.params;
  const { userId } = req;
  // TODO: Subdomain Support
  await Comment.remove({ shortId, userId, fileUuid: uuid });
  res.json({ message: 'deleted successfully' });
}

module.exports = [validate(removeValidation), remove];
