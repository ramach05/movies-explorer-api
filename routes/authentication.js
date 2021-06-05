const authenticationRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // для валидации запросов

const { login, createUser } = require('../controllers/users');

authenticationRouter.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login);

authenticationRouter.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser);

exports.authenticationRouter = authenticationRouter;
