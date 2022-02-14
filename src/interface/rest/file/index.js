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
const download = require('./download');
// middlewares
const { canEditFile, canViewFile, canCreateFile } = require('../middlewares');

router.post(
  '/create',
  asyncHandler(canCreateFile),
  fileUpload(),
  asyncHandlerArray(create),
);
router.get('/download', asyncHandler(canViewFile), asyncHandlerArray(download));
router.get('/:uuid', asyncHandler(canViewFile), asyncHandler(get));
router.post(
  '/:uuid/edit',
  asyncHandler(canEditFile),
  fileUpload(),
  asyncHandlerArray(edit),
);

module.exports = router;
