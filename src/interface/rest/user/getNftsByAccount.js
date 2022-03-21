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
  const { search = '' } = req.query;
  const nfts = await User.getNfts({ address, search });
  res.json({ nft: nfts });
}

module.exports = [validate(getNftsByAccountValidation), getNftsByAccount];
