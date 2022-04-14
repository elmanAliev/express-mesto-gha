const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

// для собирания JSON-формата
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// 62570514fe2368a40d3bde95
app.use((req, res, next) => {
  req.user = {
    _id: '62570514fe2368a40d3bde95',
  };

  next();
});

app.use('/users', require('./routes/user'));

app.use('/cards', require('./routes/card'));

app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница отсутствуе' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
