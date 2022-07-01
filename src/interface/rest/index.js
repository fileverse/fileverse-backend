const express = require('express');
const router = express.Router();

const user = require('./user');
const file = require('./file');
const content = require('./content');
const comment = require('./comment');
const audience = require('./audience');
const analytics = require('./analytics');

router.use('/account', user);
router.use('/file', file);
router.use('/content', content);
router.use('/comment', comment);
router.use('/audience', audience);
router.use('/analytics', analytics);

module.exports = router;
