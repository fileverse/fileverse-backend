const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getOrgFilesValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrgFiles(req, res) {
  // const { address } = req.params;
  const files = await File.getByAccount(
    '0x6b8ddbA9c380e68201F76072523C4aC9AC4113ae'.toLowerCase(),
  );
  res.json({ files, total: files.length, matching: files.length });
}

module.exports = [validate(getOrgFilesValidation), getOrgFiles];
