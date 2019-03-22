'use strict';

const last = require('lodash/last');
const Schema = require('jugglingdb').Schema;
const schema = new Schema('memory');

const initStorage = require('./storage');
const { storage: storageConfig } = require('./config');
const storage = initStorage(storageConfig);

const Asset = schema.define('Asset', {
  key: { type: String },
  url: { type: String },
  updatedAt: { type: Number }
});

Asset.prototype.refreshUrl = function () {
  return storage.getFileUrl(last(this.key.split('://'))).then(url => {
    this.url = url;
    return this.save();
  });
};

Asset.beforeSave = function (next) {
  this.updatedAt = new Date().getTime();
  next();
};

module.exports = {
  Asset
};
