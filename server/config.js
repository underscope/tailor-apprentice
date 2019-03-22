'use strict';

const path = require('path');

module.exports = {
  hostname: process.env.HOSTNAME,
  port: process.env.PORT,
  ip: process.env.IP,
  storage: {
    provider: process.env.STORAGE_PROVIDER,
    amazon: {
      key: process.env.STORAGE_KEY,
      secret: process.env.STORAGE_SECRET,
      region: process.env.STORAGE_REGION,
      bucket: process.env.STORAGE_BUCKET
    }
  },
  cors: {
    allowedOrigins: [],
    allowedHeaders: []
  },
  staticFolder: path.resolve(__dirname, '../dist')
};
