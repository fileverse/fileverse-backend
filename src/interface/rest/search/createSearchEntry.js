const { Search } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const createSearchEntryValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    ipfsHash: Joi.string().required(),
    previewURL: Joi.string().required(),
    prefferedGateway: Joi.string().required(),
  }),
};

async function createSearchEntry(req, res) {
  const entry = req.body;
  await Search.searchEntry(entry);
  res.json({
    success: true,
  });
}

module.exports = [validate(createSearchEntryValidation), createSearchEntry];
