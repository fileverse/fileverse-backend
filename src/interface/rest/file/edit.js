const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const editValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
  body: Joi.object({
    name: Joi.string().optional().allow(''),
    slug: Joi.string().optional(),
    description: Joi.string().optional().max(500),
    token: Joi.object({
      name: Joi.string().optional(),
      image: Joi.string().optional().allow(null, ''),
      contractAddress: Joi.string().required(),
      tokenType: Joi.string().required().valid('erc20', 'erc721'),
      gateBalance: Joi.number().required(),
      chain: Joi.string().valid('ethereum', 'polygon', 'rinkeby').optional(),
    }),
  }),
};

async function edit(req, res) {
  const { uuid } = req.params;
  const { name, token, slug, description } = req.body;
  const { address } = req;
  const updatedFile = await File.edit(uuid, {
    file: req.files && req.files.file,
    name,
    token,
    address,
    slug,
    description,
  });
  res.json(updatedFile);
}

module.exports = [validate(editValidation), edit];
