const fileUpload = require('express-fileupload');
const express = require('express');
const router = express.Router();

// domain
const create = require('./create');
const update = require('./update');
const get = require('./get');
// middlewares
const { canEditFile, canViewFile, canCreateFile } = require('../middlewares');

router.post('/create', canCreateFile, fileUpload(), create);
router.get('/:uuid', canViewFile, get);
router.post('/:uuid/edit', canEditFile, fileUpload(), update);

module.exports = router;
