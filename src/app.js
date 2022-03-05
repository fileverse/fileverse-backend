'use strict';

/*
 * This file exports the app that is used by the server to expose the routes.
 * And make the routes visible.
 */

const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errorHandler } = require('./interface/rest/middlewares');

const auth = require('./infra/utils/auth');
const router = require('./interface/rest');

// Express App
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Use default logger for now
app.use(logger('combined'));
app.use(cors());
// app.use(helmet());
app.use(auth.verifyToken);

// This is to check if the service is online or not
app.use('/ping', function (req, res) {
  res.json({ reply: 'pong' });
  res.end();
});

app.use('/', router);

app.use(errorHandler);

// Export the express app instance
module.exports = app;
