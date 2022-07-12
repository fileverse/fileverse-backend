const qs = require('querystring');
const mime = require('mime-types');
const { File } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const { Log } = require('../../../domain');

const getValidation = {
  params: Joi.object({
    uuid: Joi.string().required(),
  }),
};

async function get(req, res) {
  const { uuid } = req.params;
  const { download } = req.query;
  // TODO: Subdomain Support
  const { contentStream, mimetype, name } = await File.content(uuid);
  const extension = mime.extension(mimetype);
  const filename = `${name}.${extension}`;
  const header = {
    'Content-Type': mimetype,
  };
  if (download) {
    header['Content-Disposition'] = `attachment; filename="${qs.escape(
      filename,
    )}"`;
    await Log.create('download', uuid);
  }
  res.writeHead(200, header);
  contentStream.pipe(res);
}

module.exports = [validate(getValidation), get];
