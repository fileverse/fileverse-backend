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

router.post(
  '/create',
  asyncHandler(canEditAccount),
  fileUpload(),
  asyncHandlerArray(create),
);

router.get('/', asyncHandler(canEditAccount), asyncHandlerArray(get));

module.exports = router;
