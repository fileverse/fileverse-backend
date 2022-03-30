const { Audience } = require('../../../domain');

async function create(req, res) {
  const { address = '0x3a1Bac5e46A407bC09474378E9e49806c0128cDd' } = req;

  const result = await Audience.create(address, req.files.file);
  res.json(result);
}

module.exports = [create];
