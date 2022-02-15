const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    text: Joi.string().required(),
  }),
  query: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function create(req, res) {
  const { text } = req.body;
  const { userId } = req;
  const { uuid } = req.query;
  const createdComment = await Comment.create({
    userId,
    text,
    fileUuid: uuid,
  });
  res.json(createdComment);
}

module.exports = [validate(createValidation), create];
