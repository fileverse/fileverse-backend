const { Audience } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const airdropValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    inputType: Joi.string()
      .valid('csv', 'addressList')
      .optional()
      .default('csv'),
    addressList: Joi.array().items(Joi.string()).optional(),
    fileUuid: Joi.string().optional(),
  }),
};

async function airdrop(req, res) {
  const { address, userId } = req;
  const { name, symbol, addressList, inputType, fileUuid } = req.body;
  const foundAudience = await Audience.airdrop({
    name,
    symbol,
    owner: userId,
    ownerAddress: address,
    csv: req.files && req.files.file,
    addressList,
    inputType,
    fileUuid,
  });
  res.json({ audience: foundAudience, token: null });
}

module.exports = [validate(airdropValidation), airdrop];
