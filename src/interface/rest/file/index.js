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
const remove = require('./remove');
const analytics = require('./analytics');
// middlewares
const {
  canEditFile,
  canViewFile,
  canCreateFile,
  validateRecaptcha,
} = require('../middlewares');

router.post(
  '/create',
  asyncHandlerArray([validateRecaptcha, canCreateFile]),
  fileUpload(),
  asyncHandlerArray(create),
);
router.get(
  '/:uuid',
  asyncHandler(canViewFile),
  // asyncHandlerArray([validateRecaptcha, canViewFile]),
  asyncHandlerArray(get),
);
router.get('/:uuid/analytics', asyncHandlerArray(analytics));
router.post(
  '/:uuid/edit',
  asyncHandlerArray([validateRecaptcha, canEditFile]),
  fileUpload(),
  asyncHandlerArray(edit),
);

router.delete(
  '/:uuid/remove',
  asyncHandler(canEditFile),
  asyncHandlerArray(remove),
);

module.exports = router;
