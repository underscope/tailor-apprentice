'use strict';

const bluebird = require('bluebird');
const { promisify } = require('util');

if (process.env.NODE_ENV !== 'production') {
  bluebird.config({ longStackTraces: true });
}

const { ip, port } = require('./config');
const app = require('./app');
const logger = require('./logger')();
const runServer = promisify(app.listen.bind(app));

const address = `http://${ip}:${port}`;

runServer(port, ip)
  .then(() => logger.info({ port, ip }, '✈️  Server listening on', address))
  .catch(err => {
    logger.fatal(err, '🚨  Starting server failed');
    process.exit(1);
  });
