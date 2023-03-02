const { asyncHandlerArray } = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

const createSearchEntry = require('./createSearchEntry');
const getRecentEntries = require('./getRecentEntries');

router.get('/recent', asyncHandlerArray(getRecentEntries));
router.post('/search', asyncHandlerArray(createSearchEntry));

module.exports = router;
