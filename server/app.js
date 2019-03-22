'use strict';

const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const HttpError = require('http-errors').HttpError;
const jsend = require('jsend').middleware;
const morgan = require('morgan');
const nocache = require('nocache');
require('express-async-errors');

const config = require('./config');
const logger = require('./logger')();
const router = require('./router');

const app = express();
app.use(helmet());
app.use(cors({ origin: config.cors.allowedOrigins, credentials: true }));
app.use(bodyParser.json({ limit: config.uploadLimit }));
app.use(express.static(config.staticFolder));
app.use(jsend);

// Log http requests
const isSuccessful = res => res.statusCode <= 400;
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(format, {
  skip: (req, res) => isSuccessful(res),
  stream: process.stderr
}));
app.use(morgan(format, {
  skip: (req, res) => !isSuccessful(res),
  stream: process.stdout
}));

// Mount main router
app.use('/api/v1', nocache(), router);

// Global error handler.
app.use((err, req, res, next) => {
  if ((err instanceof HttpError)) {
    res.status(err.status).jsend.error(err.message);
    return;
  }
  res.status(INTERNAL_SERVER_ERROR).end();
  logger.error({ req, err }, '🚨  Internal Error:', err.message);
});

// Handle non-existing routes.
app.use((_, res) => res.sendStatus(NOT_FOUND));

module.exports = app;
