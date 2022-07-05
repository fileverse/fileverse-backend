const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');

const express = require('express');
const router = express.Router();

// domain
const createOrg = require('./createOrg');
const getOrg = require('./getOrg');
const getOrgMembers = require('./getOrgMembers');
const getOrgFiles = require('./getOrgFiles');
const getOrgAnalytics = require('./getOrgAnalytics');
const getOrgChatRooms = require('./getOrgChatRooms');
const archiveOrg = require('./archiveOrg');

// middlewares
const { canCreateOrg, canEditOrg, canViewOrg } = require('../middlewares');

// routes

// create an organisation
router.post(
  '/create',
  asyncHandler(canCreateOrg),
  asyncHandlerArray(createOrg),
);

// get details of an organisation
router.get('/:address', asyncHandler(canViewOrg), asyncHandlerArray(getOrg));

// get member list of an organisation
router.get(
  '/:address/members',
  asyncHandler(canViewOrg),
  asyncHandlerArray(getOrgMembers),
);

// get file list of an organisation
router.get(
  '/:address/files',
  asyncHandler(canViewOrg),
  asyncHandlerArray(getOrgFiles),
);

// get file list of an organisation
router.get(
  '/:address/analytics',
  asyncHandler(canViewOrg),
  asyncHandlerArray(getOrgAnalytics),
);

// get chat room list of an organisation
router.get(
  '/:address/chat-rooms',
  asyncHandler(canViewOrg),
  asyncHandlerArray(getOrgChatRooms),
);

// archive an organisation
router.delete(
  '/:address',
  asyncHandler(canEditOrg),
  asyncHandlerArray(archiveOrg),
);

module.exports = router;
