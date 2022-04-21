const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getNftsByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  query: Joi.object({
    search: Joi.string().optional(),
    chain: Joi.string().valid('ethereum', 'polygon', 'rinkeby').optional(),
  }),
};

async function getNftsByAccount(req, res) {
  const { address } = req.params;
  const { search = '', chain } = req.query;
  const nfts = await User.getNfts({ address, search, chain });
  res.json({ nft: nfts });
}

module.exports = [validate(getNftsByAccountValidation), getNftsByAccount];
