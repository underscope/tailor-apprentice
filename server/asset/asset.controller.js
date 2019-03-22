'use strict';

const { addDays } = require('date-fns');
const { Asset } = require('../database');
const Promise = require('bluebird');

async function signUrls({ body }, res) {
  const { keys = [] } = body;
  const date = new Date();
  const refreshTresh = addDays(date, -2).getTime();
  const expirationTresh = addDays(date, -5).getTime();
  const data = await Promise.map(keys, async key => {
    const existing = await Asset.findOne({ where: { key } });
    if (existing && (existing.updatedAt > refreshTresh)) return existing;
    if (existing && (existing.updatedAt > expirationTresh)) {
      // Async update (passed refresh tresh but not yet expired.
      // Prolong in cache.
      existing.refreshUrl();
      return existing;
    }
    const asset = existing || new Asset({ key });
    return asset.refreshUrl();
  });
  return res.json(data);
}

module.exports = {
  signUrls
};
