const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

// domain
const login = require('./login');
const getAccount = require('./getAccount');
const updateAccount = require('./updateAccount');
const getFilesByAccount = require('./getFilesByAccount');

// middlewares
const { canViewAccount, canEditAccount } = require('../middlewares');

router.post('/:address/login', asyncHandlerArray(login));
router.get(
  '/:address',
  asyncHandler(canViewAccount),
  asyncHandlerArray(getAccount),
);
router.post(
  '/:address',
  asyncHandler(canEditAccount),
  asyncHandlerArray(updateAccount),
);
router.get(
  '/:address/all',
  asyncHandler(canEditAccount),
  asyncHandlerArray(getFilesByAccount),
);

module.exports = router;
