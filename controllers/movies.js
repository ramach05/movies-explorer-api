const BadRequest = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const Movies = require('../models/movie');

exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.status(200).send({ movies: movies.reverse() }))
    .catch(next);
};

exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;

  Movies.create({
    country, director, duration, year, description, image, trailer, thumbnail, owner, movieId, nameRU, nameEN,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequest();
      }
      return res.status(200).send({ movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(err.message);
      }
      return next(err);
    })
    .catch(next);
};

exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movies.findById(movieId)
    .orFail(() => new NotFoundError('Фильм с указанным _id не найден')) //если приходит пустой объект, назначает ошибку и переходит в catch
    .then((movie) => {
      if (req.user._id === movie.owner.toString()) {
        Movies.findByIdAndRemove(movieId);
        return res.status(200).send({ movie });
      }
      throw new BadRequest('Нельзя удалять фильмы других пользователей');
    })
    .catch(next);
};
