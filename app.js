const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config(); // добавляет env-переменные в process.env

const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleErrors } = require('./errors/handleErrors');
const { Routes } = require('./routes');
const { limiter } = require('./middlewares/rateLimit');

const {
  PORT = 3001,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

const app = express();

mongoose.connect(
  MONGO_URL,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
);

app.use(helmet()); // помогает защитить приложение от некоторых широко известных веб-уязвимостей
// путем соответствующей настройки заголовков HTTP
app.use(express.json()); // добавляется в запрос поле req.body
app.use(cors()); // защита роутов
app.use(requestLogger); // логгер запросов
app.use(limiter); // защита от DoS-атак

app.use((req, res, next) => { // вывод в консоль метода и пути запроса
  console.log(req.method, req.path);
  next();
});

app.use(Routes);

// app.use('*', (req, res, next) => Users.findOne({})
//   .then(() => {
//     throw new NotFoundError('Ресурс не найден');
//   })
//   .catch(next)); //эквивалентно catch(err => next(err))

app.use('*', (req, res, next) => next(new NotFoundError('Ресурс не найден')));

app.use(errorLogger); // логгер ошибок

app.use(require('celebrate').errors()); // обрабатывает ошибки celebrate

app.use(handleErrors); // централизованная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
