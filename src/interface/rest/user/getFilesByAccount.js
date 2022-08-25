const parse = require('url-parse');
const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

function addSessionToFileUrl(file, sessionId) {
  if (!file || !file.url || !sessionId) {
    return file;
  }
  const url = parse(file.url, true);
  const query = url.query;
  query.sessionId = sessionId;
  url.set('query', query);
  file.url = url.toString();
  return file;
}

const getFilesByAccountValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
  query: Joi.object({
    page: Joi.number().optional(),
  }),
};

async function getFilesByAccount(req, res) {
  const { address } = req.params;
  const { page } = req.query;
  const files = await File.getByAccount({
    address: address.toLowerCase(),
    page,
  });
  res.json({
    file: files.map((file) => addSessionToFileUrl(file, req.sessionId)),
  });
}

module.exports = [validate(getFilesByAccountValidation), getFilesByAccount];
