const { Comment } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createValidation = {
  body: Joi.object({
    text: Joi.string().required(),
  }),
  params: Joi.object({
    fileUuid: Joi.string().required(),
  }),
};

async function create(req, res) {
  const { text } = req.body;
  const { userId, address } = req;
  const { fileUuid } = req.params;
  const createdComment = await Comment.create({
    userId,
    text,
    fileUuid,
    address,
  });
  res.json(createdComment);
}

module.exports = [validate(createValidation), create];
