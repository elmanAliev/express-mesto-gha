const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера: ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findById(id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else if (String(card.owner) === req.user._id) {
        Card.findByIdAndRemove(id)
          .then(() => res.status(200).send({ message: 'Карточка удалена' }))
          .catch(() => res.status(400).send({ message: 'Некорректные данные' }));
      } else {
        throw new Error('У вас нет прав на удаление данной карты');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
