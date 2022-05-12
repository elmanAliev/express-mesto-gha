const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors, Joi } = require('celebrate');
const NotFoundErr = require('./errors/NotFoundErr');
const handleError = require('./middlewares/handleError');
const {
  createUser,
  login,
} = require('./controllers/user');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
// импорт роутеров
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');

const { PORT = 3000 } = process.env;
const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// подключаем логгер запросов
app.use(requestLogger);

app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// запуск роутеров
// роуты, не требующие авторизации,
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res, next) => {
  next(new NotFoundErr('Запрашиемая страница не найдена'));
});

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT);
