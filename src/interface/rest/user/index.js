const express = require('express');
const router = express.Router();

// domain
const getAccount = require('./getAccount');
const updateAccount = require('./updateAccount');
const getFilesByAccount = require('./getFilesByAccount');

// middlewares
const { canViewAccount, canEditAccount } = require('../middlewares');

router.get('/:address', canViewAccount, getAccount);
router.post('/:address', canEditAccount, updateAccount);
router.get('/:address/all', canEditAccount, getFilesByAccount);

module.exports = router;
