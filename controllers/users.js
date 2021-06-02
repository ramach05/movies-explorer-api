require("dotenv").config();

const validator = require("validator"); //для валидации полей
const bcrypt = require("bcryptjs"); //для хеширования паролей
const jwt = require("jsonwebtoken"); //для создания токенов
const Users = require("../models/user");
const NotFoundError = require("../errors/not-found-err");
const Unauthorized = require("../errors/unauthorized-err");
const BadRequest = require("../errors/bad-request-err");
const Conflict = require("../errors/conflict-err");

const { JWT_SECRET_KEY = "dev-key" } = process.env; //секретный ключ подписи

exports.getMe = (req, res, next) => {
	const { _id } = req.user;

	Users.findOne({ _id })
		.then((user) => {
			if (user) {
				console.log("req.user :", req.user);
				return res.status(200).send({ user });
			}
			throw new NotFoundError("Пользователь не найден");
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
			new NotFoundError("Переданы некорректные данные при обновлении профиля"),
		)
		.then((user) => res.status(200).send({ user }))
		.catch((err) => {
			if (err.name === "ValidationError") {
				return next(
					new BadRequest("Переданы некорректные данные при обновлении профиля"),
				);
			}
			return next(err);
		});
};
