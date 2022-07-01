const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

const canViewFile = require('../middlewares/canViewFile');

const create = require('./create');

router.post('/log', asyncHandler(canViewFile), asyncHandlerArray(create));

module.exports = router;
