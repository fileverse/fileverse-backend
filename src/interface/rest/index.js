const express = require('express');
const router = express.Router();

const user = require('./user');
const file = require('./file');
const content = require('./content');
const comment = require('./comment');
const audience = require('./audience');
const log = require('./log');
const org = require('./org');
const feedback = require('./feedback');

router.use('/account', user);
router.use('/file', file);
router.use('/content', content);
router.use('/comment', comment);
router.use('/audience', audience);
router.use('/log', log);
router.use('/org', org);
router.use('/feedback', feedback);

module.exports = router;
