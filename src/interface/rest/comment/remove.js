const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const removeValidation = {
  params: Joi.object({
    shortId: Joi.string().required(),
    fileUuid: Joi.string().required(),
  }),
};

async function remove(req, res) {
  const { shortId, fileUuid } = req.params;
  const { userId } = req;
  await Comment.remove({ shortId, userId, fileUuid });
  res.json({ message: 'deleted successfully' });
}

module.exports = [validate(removeValidation), remove];
