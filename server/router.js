'use strict';

const asset = require('./asset');
const express = require('express');

const router = express.Router();
router.use(asset.path, asset.router);

module.exports = router;
