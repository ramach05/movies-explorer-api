const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  updateUserProfile,
  getMe,
} = require('../controllers/users');

//запросы
usersRouter.get('/users/me', getMe);

usersRouter.patch('/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().regex(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
    }),
  }),
  updateUserProfile);

exports.usersRouter = usersRouter;
