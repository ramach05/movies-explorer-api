const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const linkRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
// const cyrillicRegex = /^[а-яё -]+$/i;
// const latinRegex = /^[a-z -]+$/i;

// запросы
movieRouter.get('/movies', getMovies);

movieRouter.post('/movies',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(linkRegex),
      trailer: Joi.string().required().regex(linkRegex),
      thumbnail: Joi.string().required().regex(linkRegex),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie);

movieRouter.delete('/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteMovie);

exports.movieRouter = movieRouter;
