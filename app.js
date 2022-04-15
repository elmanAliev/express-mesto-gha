const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// временная авторизация 62570514fe2368a40d3bde95
app.use((req, res, next) => {
  req.user = {
    _id: '62570514fe2368a40d3bde95',
  };

  next();
});

// запуск роутеров
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница отсутствует' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
