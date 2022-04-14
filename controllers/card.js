const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => console.log(err));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => (err.name === 'ValidationError'
      ? res.status(400).send({ message: 'Некорректные данные' })
      : res.status(500).send({ message: 'Произошла ошибка' })));
};

module.exports.deleteCard = (req, res) => {
  const id = req.params.cardId;
  Card.findByIdAndRemove(id)
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Такой карточки нет!' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({ message: 'Некорректные данные' })
      : res.status(500).send({ message: 'Произошла ошибка' })));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Такой карточки нет!' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({ message: 'Некорректные данные' })
      : res.status(500).send({ message: 'Произошла ошибка' })));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => ((!card)
      ? res.status(404).send({ message: 'Такой карточки нет!' })
      : res.send({ data: card })))
    .catch((err) => (err.name === 'CastError'
      ? res.status(400).send({ message: 'Некорректные данные' })
      : res.status(500).send({ message: 'Произошла ошибка' })));
};
