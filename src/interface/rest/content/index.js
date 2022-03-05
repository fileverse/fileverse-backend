const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

// domain
const get = require('./get');
// middlewares
const { canViewFile } = require('../middlewares');

router.get('/:uuid', asyncHandler(canViewFile), asyncHandlerArray(get));

module.exports = router;
