const { asyncHandlerArray } = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

const create = require('./create');

router.post('/', asyncHandlerArray(create));

module.exports = router;
