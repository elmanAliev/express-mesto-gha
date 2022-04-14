const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => console.log(err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => (err.name === 'ValidationError'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Карта не найдена' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Карта не найдена' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Карта не найдена' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({ message: 'Переданны некорректные данные' })
      : res.status(500).send({ message: 'Ошибка сервера' })));
};