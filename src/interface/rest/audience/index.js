const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

const fileUpload = require('express-fileupload');

const create = require('./create');
const canEditAccount = require('../middlewares/canEditAccount');
const get = require('./get');
const airdrop = require('./airdrop');

router.post(
  '/create',
  asyncHandler(canEditAccount),
  fileUpload(),
  asyncHandlerArray(create),
);

router.get('/:uuid', asyncHandler(canEditAccount), asyncHandlerArray(get));

router.post(
  '/:uuid/airdrop',
  asyncHandler(canEditAccount),
  asyncHandlerArray(airdrop),
);

module.exports = router;
