const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const fileUpload = require('express-fileupload');
const express = require('express');
const router = express.Router();

const comment = require('./../comment');

// domain
const create = require('./create');
const edit = require('./edit');
const get = require('./get');
// middlewares
const { canEditFile, canViewFile, canCreateFile } = require('../middlewares');

router.post(
  '/create',
  asyncHandler(canCreateFile),
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
// File comments routes
router.use('/:uuid/comment', comment);

module.exports = router;
