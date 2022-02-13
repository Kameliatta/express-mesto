const Card = require('../models/card');
const { ERROR_CODE, UNDEFINED_CODE } = require('../utils/errors');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(UNDEFINED_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан невалидный id' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(UNDEFINED_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан невалидный id' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(UNDEFINED_CODE).send({ message: 'Передан несуществующий _id карточки' });
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Передан невалидный id' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
