const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {
  createUser,
  login,
} = require('./controllers/user');
const auth = require('./middlewares/auth');

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

// запуск роутеров
// роуты, не требующие авторизации,
app.post('/signin', login);
app.post('/signup', createUser);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница отсутствует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
