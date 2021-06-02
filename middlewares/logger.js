const winston = require("winston");
const expressWinston = require("express-winston");

//создадим логгер запросов
const requestLogger = expressWinston.logger({
	transports: [ //куда нужно писать лог (request.log)
		new winston.transports.File({ filename: "logs/request.log" }),
	],
	format: winston.format.json(),
});

//логгер ошибок
const errorLogger = expressWinston.errorLogger({
	transports: [
		new winston.transports.File({ filename: "logs/error.log" }),
	],
	format: winston.format.json(),
});

module.exports = {
	requestLogger,
	errorLogger,
};
