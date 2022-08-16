const {
  asyncHandler,
  asyncHandlerArray,
} = require('../../../infra/utils/asyncHandler');
const fileUpload = require('express-fileupload');
const express = require('express');
const router = express.Router();

//domain

const create = require('./create');
const get = require('./get');
const switchRecording = require('./switchRecording');
const sessions = require('./sessions');

//middlewares
const { canCreateFile, canViewFile } = require('../middlewares');

router.post(
  '/create',
  asyncHandlerArray([canCreateFile]),
  fileUpload(),
  asyncHandlerArray(create),
);

router.patch('/:streamId/record', asyncHandlerArray(switchRecording));
router.get('/:streamId', asyncHandler(canViewFile), asyncHandlerArray(get));
router.get('/:streamId/sessions', asyncHandlerArray(sessions));

module.exports = router;
