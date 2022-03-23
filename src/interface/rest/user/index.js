const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');

// domain
const login = require('./login');
const getAccount = require('./getAccount');
const editAccount = require('./editAccount');
const getFilesByAccount = require('./getFilesByAccount');
const getNftsByAccount = require('./getNftsByAccount');
const getTokensByAccount = require('./getTokensByAccount');
const addAvatar = require('./addAvatar');

// middlewares
const {
  canViewAccount,
  canEditAccount,
  isImagePresent,
  validateRecaptcha,
} = require('../middlewares');

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
  asyncHandlerArray([validateRecaptcha, canEditAccount]),
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
router.post(
  '/:address/avatar',
  asyncHandler(canEditAccount),
  fileUpload(),
  isImagePresent,
  asyncHandlerArray(addAvatar),
);

module.exports = router;
