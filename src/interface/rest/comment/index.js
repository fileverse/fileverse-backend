const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

// middleware
const canViewFile = require('../middlewares/canViewFile');

const create = require('./create');
const get = require('./get');
const remove = require('./remove');
const edit = require('./edit');
const canEditComment = require('../middlewares/canEditComment');

router.get(':uuid/all', asyncHandler(canViewFile), asyncHandlerArray(get));
router.post(
  ':uuid/create',
  asyncHandler(canViewFile),
  asyncHandlerArray(create),
);
router.put(
  ':uuid/:shortId/edit',
  asyncHandler(canEditComment),
  asyncHandlerArray(edit),
);
router.delete(
  ':uuid/:shortId/remove',
  asyncHandler(canEditComment),
  asyncHandlerArray(remove),
);

module.exports = router;
