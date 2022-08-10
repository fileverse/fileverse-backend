const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

//domain
const create = require('./create');
const get = require('./get');
const fileUpload = require('express-fileupload');

const { canCreateFile, canViewFile } = require('../middlewares');

router.post(
  '/create',
  asyncHandlerArray([canCreateFile]),
  fileUpload(),
  asyncHandlerArray(create),
);

router.get('/:streamId', asyncHandler(canViewFile), asyncHandlerArray(get));

module.exports = router;
