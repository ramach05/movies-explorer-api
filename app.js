const express = require("express");
const mongoose = require("mongoose");
// const { celebrate, Joi } = require("celebrate"); //для валидации запросов
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

const Users = require("./models/user");
const { usersRouter } = require("./routes/users");
const NotFoundError = require("./errors/not-found-err");
const { auth } = require("./middlewares/auth");
const { movieRouter } = require("./routes/movies");
const { handleErrors } = require("./errors/handleErrors");

const app = express();

const {
	PORT = 3001,
	MONGO_URL = "mongodb://localhost:27017/bitfilmsdb",
} = process.env;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, //15 minutes
	max: 500, //limit each IP to 500 requests per windowMs
});

mongoose.connect(
	MONGO_URL,
	{
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	},
);

app.use(helmet()); //помогает защитить приложение от некоторых широко известных веб-уязвимостей путем соответствующей настройки заголовков HTTP
app.use(express.json()); //добавляется в запрос поле req.body
app.use(cors()); //защита роутов
app.use(limiter); //защита от DoS-атак

app.use((req, res, next) => { //вывод в консоль метода и пути запроса
	console.log(req.method, req.path);
	next();
});

// app.use(auth, usersRouter);
// app.use(auth, movieRouter);
app.use(usersRouter);
app.use(movieRouter);

app.use("*", (req, res, next) => Users.findOne({})
	.then(() => {
		throw new NotFoundError("Ресурс не найден");
	})
	.catch(next)); //эквивалентно catch(err => next(err))

app.use(handleErrors); //централизованная обработка ошибок

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`);
});
