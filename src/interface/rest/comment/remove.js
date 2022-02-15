const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const removeValidation = {
  params: Joi.object({
    shortId: Joi.string().required(),
  }),
};

async function remove(req, res) {
  const { shortId } = req.params;
  const { userId } = req;
  await Comment.remove(shortId, userId);
  res.json({ message: 'deleted successfully' });
}

module.exports = [validate(removeValidation), remove];
