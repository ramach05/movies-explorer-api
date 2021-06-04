const express = require('express');

const { auth } = require('../middlewares/auth');
const { authenticationRouter } = require('./authentication');
const { movieRouter } = require('./movies');
const { usersRouter } = require('./users');

const app = express();

exports.Routes = app.use(authenticationRouter);
exports.Routes = app.use(auth, usersRouter);
exports.Routes = app.use(auth, movieRouter);
