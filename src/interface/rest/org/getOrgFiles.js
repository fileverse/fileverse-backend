const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getOrgFilesValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrgFiles(req, res) {
  const { address } = req.params;
  res.json({ address });
}

module.exports = [validate(getOrgFilesValidation), getOrgFiles];
