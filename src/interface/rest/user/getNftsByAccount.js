const { User } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getNftsByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getNftsByAccount(req, res) {
  const { address } = req.params;
  const { search, chain } = req.query;
  const nfts = await User.getNfts(address, search || '', chain || 'eth');
  res.json({ nft: nfts });
}

module.exports = [validate(getNftsByAccountValidation), getNftsByAccount];
