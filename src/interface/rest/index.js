const express = require('express');
const router = express.Router();

const user = require('./user');
const file = require('./file');

router.use('/account', user);
router.use('/file', file);

module.exports = router;
