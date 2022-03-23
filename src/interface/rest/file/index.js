const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const fileUpload = require('express-fileupload');
const express = require('express');
const router = express.Router();

// domain
const create = require('./create');
const edit = require('./edit');
const get = require('./get');
// middlewares
const {
  canEditFile,
  canViewFile,
  canCreateFile,
  validateRecaptcha,
} = require('../middlewares');

router.post(
  '/create',
  asyncHandlerArray([canCreateFile, validateRecaptcha]),
  fileUpload(),
  asyncHandlerArray(create),
);
router.get('/:uuid', asyncHandler(canViewFile), asyncHandlerArray(get));
router.post(
  '/:uuid/edit',
  asyncHandler(canEditFile),
  fileUpload(),
  asyncHandlerArray(edit),
);

module.exports = router;
