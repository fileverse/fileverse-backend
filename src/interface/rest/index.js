const express = require('express');
const router = express.Router();

const user = require('./user');
const file = require('./file');
const comment = require('./comment');

router.use('/account', user);
router.use('/file', file);
router.use('/comment', comment);

module.exports = router;
