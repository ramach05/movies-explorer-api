const movieRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
	getMovies,
	createMovie,
	deleteMovie,
} = require("../controllers/movies");

//запросы
movieRouter.get("/movies", getMovies);

movieRouter.post("/movies",
	celebrate({
		body: Joi.object().keys({
			country: Joi.string().required(),
			director: Joi.string().required(),
			duration: Joi.number().required(),
			year: Joi.string().required(),
			description: Joi.string().required(),
			image: Joi.string().required().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
			trailer: Joi.string().required().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
			thumbnail: Joi.string().required().regex(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
			movieId: Joi.string().required(),
			nameRU: Joi.string().required().regex(/^[а-яё -]+$/i),
			nameEN: Joi.string().required().regex(/^[a-z -]+$/i),
		}),
	}),
	createMovie);

movieRouter.delete("/movies/:movieId",
	celebrate({
		params: Joi.object().keys({
			movieId: Joi.string().length(24).hex(),
		}),
	}),
	deleteMovie);

exports.movieRouter = movieRouter;
