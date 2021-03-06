const express = require('express');
const router = express.Router();

const user = require('./user');
const file = require('./file');
const content = require('./content');
const comment = require('./comment');
const audience = require('./audience');
const log = require('./log');
const org = require('./org');

router.use('/account', user);
router.use('/file', file);
router.use('/content', content);
router.use('/comment', comment);
router.use('/audience', audience);
router.use('/log', log);
router.use('/org', org);

module.exports = router;
