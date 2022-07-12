const { validator } = require('../middlewares');
const { Joi, validate } = validator;

const getOrgChatRoomsValidation = {
  params: Joi.object({
    address: Joi.string().required(),
  }),
};

async function getOrgChatRooms(req, res) {
  const { address } = req.params;
  res.json({ address });
}

module.exports = [validate(getOrgChatRoomsValidation), getOrgChatRooms];
