const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getValidation = {
  params: Joi.object({
    fileUuid: Joi.string().required(),
  }),
};

async function get(req, res) {
  const { fileUuid } = req.params;
  const comments = await Comment.get(fileUuid);
  res.json(comments);
}

module.exports = [validate(getValidation), get];
