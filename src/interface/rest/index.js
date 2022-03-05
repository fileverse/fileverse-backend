const express = require('express');
const router = express.Router();

const user = require('./user');
const file = require('./file');
const content = require('./content');
const comment = require('./comment');

router.use('/account', user);
router.use('/file', file);
router.use('/content', content);
router.use('/comment', comment);

module.exports = router;
