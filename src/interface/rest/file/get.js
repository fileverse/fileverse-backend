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

const getValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function get(req, res) {
  const { uuid } = req.params;
  const file = await File.get(uuid);
  file.currentPermission = await File.permission({
    uuid,
    userId: req && req.userId,
    address: req && req.address,
  });
  res.json(addSessionToFileUrl(file, req.sessionId));
}

module.exports = [validate(getValidation), get];
