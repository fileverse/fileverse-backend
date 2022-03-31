const { Audience } = require('../../../domain');

async function create(req, res) {
  const { address } = req;

  const result = await Audience.create(address, req.files.file);
  res.json(result);
}

module.exports = [create];
