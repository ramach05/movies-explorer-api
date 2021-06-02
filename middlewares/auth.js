require("dotenv").config();

const jwt = require("jsonwebtoken");
const Unauthorized = require("../errors/unauthorized-err");

const { JWT_SECRET_KEY = "dev-key" } = process.env; //секретный ключ подписи

exports.auth = (req, res, next) => {
	const { authorization } = req.headers; //достаём авторизационный заголовок

	if (!authorization) {
		return next(new Unauthorized("Необходима авторизация"));
	}
	const token = authorization.replace("Bearer ", ""); //извлечём токен и отделим от заголовка приставку, если она есть
	let payload;
	try {
		payload = jwt.verify(token, JWT_SECRET_KEY); //пытаемся верифицировать токен (два параметра — токен и секретный ключ), verify вернёт пейлоуд токена после проверки
	} catch (err) {
		return next(new Unauthorized("Необходима авторизация"));
	}

	req.user = payload; //записываем пейлоуд в объект запроса
	return next(); //пропускаем запрос дальше
};
