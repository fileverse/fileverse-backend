const { Search } = require('../../../domain');
const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getRecentEntriesValidation = {
  query: Joi.object({}),
};

async function getRecentEntries(req, res) {
  const searches = await Search.getRecents();
  res.json({
    searches,
  });
}

module.exports = [validate(getRecentEntriesValidation), getRecentEntries];
