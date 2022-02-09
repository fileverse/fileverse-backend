const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();

// domain
const login = require('./login');
const getAccount = require('./getAccount');
const editAccount = require('./editAccount');
const getFilesByAccount = require('./getFilesByAccount');
const getNftsByAccount = require('./getNftsByAccount');
const getTokensByAccount = require('./getTokensByAccount');

// middlewares
const { canViewAccount, canEditAccount } = require('../middlewares');

router.post('/:address/login', asyncHandlerArray(login));
router.get(
  '/:address',
  asyncHandler(canViewAccount),
  asyncHandlerArray(getAccount),
);
router.post(
  '/:address/edit',
  asyncHandler(canEditAccount),
  asyncHandlerArray(editAccount),
);
router.get(
  '/:address/all',
  asyncHandler(canEditAccount),
  asyncHandlerArray(getFilesByAccount),
);
router.get(
  '/:address/nfts',
  asyncHandler(canEditAccount),
  asyncHandlerArray(getNftsByAccount),
);
router.get(
  '/:address/tokens',
  asyncHandler(canEditAccount),
  asyncHandlerArray(getTokensByAccount),
);

module.exports = router;
