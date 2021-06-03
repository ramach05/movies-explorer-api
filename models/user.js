const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Введите валидный имейл',
      ],
    },
    password: {
      type: String,
      required: true,
      select: false, //чтобы хеш пароля не возвращался (работает только в методах find)
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
  },

  { versionKey: false }, //для отключения поля '__v'
);

module.exports = mongoose.model('user', userSchema); //в компасе к названию коллекции добавляется s
