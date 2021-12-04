const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getFilesByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getFilesByAccount(req, res) {
  const { address } = req.params;
  const files = await File.getByAccount(address);
  res.json({ file: files });
}

module.exports = [validate(getFilesByAccountValidation), getFilesByAccount];
