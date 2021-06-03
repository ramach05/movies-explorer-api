require('dotenv').config();

const validator = require('validator'); //для валидации полей
const bcrypt = require('bcryptjs'); //для хеширования паролей
const jwt = require('jsonwebtoken'); //для создания токенов
const Users = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const Unauthorized = require('../errors/unauthorized-err');
const BadRequest = require('../errors/bad-request-err');
const Conflict = require('../errors/conflict-err');

const { JWT_SECRET_KEY = 'dev-key' } = process.env; //секретный ключ подписи

exports.getMe = (req, res, next) => {
  const { _id } = req.user;

  Users.findOne({ _id })
    .then((user) => {
      if (user) {
        console.log('req.user :', req.user);
        return res.status(200).send({ user });
      }
      throw new NotFoundError('Пользователь не найден');
    })
    .catch(next);
};

exports.updateUserProfile = (req, res, next) => {
  const { name, email } = req.body;
  Users.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      runValidators: true, //для автоматической валидации при запросе
      new: true, //обработчик then получит на вход обновлённую запись
    },
  )
    .orFail(
      new NotFoundError('Переданы некорректные данные при обновлении профиля'),
    )
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequest('Переданы некорректные данные при обновлении профиля'),
        );
      }
      return next(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  Users.findOne({ email })
    .select('+password') //возвращает скрытый хеш пароля
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неправильные почта или пароль');
      }

      return bcrypt
        .compare(password, user.password) //сравниваем пароль с хешем в базе (работает асинхронно, в then придёт true при совпадении)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: user.id }, //пейлоуд токена — зашифрованный в строку объект пользователя
            JWT_SECRET_KEY,
            { expiresIn: '7d' }, //объект опций, через сколько токен будет просрочен
          );
          return res.send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body; //получим из объекта запроса данные пользователя

  if (!email || !password) {
    throw new BadRequest('Не переданы email или пароль');
  }
  return Users.findOne({ email })
    .then((userWithEmail) => {
      if (userWithEmail) {
        throw new Conflict('Пользователь с таким email уже существует');
      }
      if (validator.isEmail(email)) {
        const normalizeEmail = validator.normalizeEmail(email); //sanitizers
        return bcrypt
          .hash(password, 10) //хешируем пароль
          .then((hash) => Users.create({
            name,
            email: normalizeEmail,
            password: hash,
          }))
          .then((user) => res.status(200).send({ ...user._doc, password: undefined })) //скрываем пароль в ответе
          .catch((err) => {
            if (err.name === 'MongoError' && err.code === 11000) {
              return next(
                new Conflict('Пользователь с таким email уже существует'),
              );
            }
            if (err.name === 'ValidationError') {
              return next(
                new BadRequest(
                  'Переданы некорректные данные при создании пользователя',
                ),
              );
            }
            return next(err);
          }); //если данные не записались, вернём ошибку
      }
      return next(new Error());
    })
    .catch(next);
};
