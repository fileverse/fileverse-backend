const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const editValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().optional().allow(''),
    description: Joi.string().optional().max(500),
    token: Joi.object({
      contractAddress: Joi.string().required(),
      chain: Joi.string(),
      tokenType: Joi.string().required().valid('erc20', 'erc721'),
      gateBalance: Joi.number().required(),
    }),
  }),
};

async function edit(req, res) {
  const { uuid } = req.params;
  const { name, token, description } = req.body;
  const { address } = req;
  const updatedFile = await File.edit(uuid, {
    file: req.files && req.files.file,
    name,
    token,
    address,
    description,
  });
  res.json(updatedFile);
}

module.exports = [validate(editValidation), edit];
