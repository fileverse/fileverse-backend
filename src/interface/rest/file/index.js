const asyncHandler = require('../../../infra/utils/asyncHandler');
const fileUpload = require('express-fileupload');
const express = require('express');
const router = express.Router();

// domain
const create = require('./create');
const update = require('./update');
const get = require('./get');
// middlewares
const { canEditFile, canViewFile, canCreateFile } = require('../middlewares');

router.post(
  '/create',
  asyncHandler(canCreateFile),
  fileUpload(),
  asyncHandler(create),
);
router.get('/:uuid', asyncHandler(canViewFile), asyncHandler(get));
router.post(
  '/:uuid/edit',
  asyncHandler(canEditFile),
  fileUpload(),
  asyncHandler(update),
);

module.exports = router;
