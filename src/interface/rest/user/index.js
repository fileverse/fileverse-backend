const asyncHandler = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

// domain
const login = require('./login');
const getAccount = require('./getAccount');
const updateAccount = require('./updateAccount');
const getFilesByAccount = require('./getFilesByAccount');

// middlewares
const { canViewAccount, canEditAccount } = require('../middlewares');

router.post('/:address/login', asyncHandler(login));
router.get('/:address', asyncHandler(canViewAccount), asyncHandler(getAccount));
router.post(
  '/:address',
  asyncHandler(canEditAccount),
  asyncHandler(updateAccount),
);
router.get(
  '/:address/all',
  asyncHandler(canEditAccount),
  asyncHandler(getFilesByAccount),
);

module.exports = router;
