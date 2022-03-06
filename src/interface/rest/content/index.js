const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

// domain
const get = require('./get');
// middlewares
const { canViewContent } = require('../middlewares');

router.get('/:uuid', asyncHandler(canViewContent), asyncHandlerArray(get));

module.exports = router;
