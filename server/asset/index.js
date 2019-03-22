'use strict';

const ctrl = require('./asset.controller');
const router = require('express').Router();

router
  .post('/sign', ctrl.signUrls);

module.exports = {
  path: '/asset',
  router
};
