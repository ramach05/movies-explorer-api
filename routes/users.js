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
      email: Joi.string().required().email(),
    }),
  }),
  updateUserProfile);

exports.usersRouter = usersRouter;
