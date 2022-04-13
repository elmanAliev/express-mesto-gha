const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('**********Подключено к Базе**********');
});

// 62570514fe2368a40d3bde95
app.use((req, res, next) => {
  req.user = {
    _id: '6252baba9668039904da0029',
  };

  next();
});

app.use('/users', require('./routes/user'));

app.use('/cards', require('./routes/card'));

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница отсутсвует' });
});

app.listen(PORT);
