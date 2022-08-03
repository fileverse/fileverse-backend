const qs = require('querystring');
// const mime = require('mime-types');
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
  const { contentStream, mimetype, extension, name } = await File.content(uuid);
  const fileName = `${name}.${extension}`;

  const header = {
    'Content-Type': mimetype,
  };
  if (download && settings.downloadable) {
    header['Content-Disposition'] = `attachment; filename="${qs.escape(
      fileName,
    )}"`;
    await Log.create('download', uuid);
  }
  res.writeHead(200, header);
  contentStream.pipe(res);
}

module.exports = [validate(getValidation), get];
