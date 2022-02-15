const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getValidation = {
  query: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function get(req, res) {
  const { uuid } = req.query;
  const comments = await Comment.get(uuid);
  res.json(comments);
}

module.exports = [validate(getValidation), get];
