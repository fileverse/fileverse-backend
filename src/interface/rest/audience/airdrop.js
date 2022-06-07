const { Audience } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const airdropValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    description: Joi.string().optional(),
    inputType: Joi.string()
      .valid('csv', 'addressList')
      .optional()
      .default('csv'),
    addressList: Joi.string().optional(),
    fileUuid: Joi.string().optional(),
  }),
};

async function airdrop(req, res) {
  const { address, userId } = req;
  const { name, symbol, addressList, description, inputType, fileUuid } =
    req.body;

  const foundAudience = await Audience.airdrop({
    name,
    symbol,
    description,
    owner: userId,
    ownerAddress: address,
    csv: req.files && req.files.file,
    addressList,
    inputType,
    fileUuid,
    tokenImage: req.files && req.files.tokenImage,
  });
  res.json({ audience: foundAudience, token: null });
}

module.exports = [validate(airdropValidation), airdrop];
