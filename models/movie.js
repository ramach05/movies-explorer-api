const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        'Введите правильную ссылку',
      ],
    },
    trailer: {
      type: String,
      required: true,
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        'Введите правильную ссылку',
      ],
    },
    thumbnail: {
      type: String,
      required: true,
      match: [
        /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        'Введите правильную ссылку',
      ],
    },
    owner: {
      type: String,
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
      match: [
        /^[а-яё -]+$/i,
        'Введите название фильма на русском языке',
      ],
    },
    nameEN: {
      type: String,
      required: true,
      match: [
        /^[a-z -]+$/i,
        'Введите название фильма на английском языке',
      ],
    },
  },

  { versionKey: false }, // для отключения поля '__v'
);

module.exports = mongoose.model('movie', movieSchema); // в компасе к названию коллекции добавляется s
