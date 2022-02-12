const Card = require('../models/card');

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  const ERROR_CODE = 404;

  Card.findByIdAndRemove(req.body._id)
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ERROR_CODE = 400;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  const ERROR_CODE = 400;
  const UNDEFINED_CODE = 404;

  Card.findByIdAndUpdate(
    req.body.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      res.status(UNDEFINED_CODE).send({ message: 'Передан несуществующий _id карточки' });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const ERROR_CODE = 400;
  const UNDEFINED_CODE = 404;

  Card.findByIdAndUpdate(
    req.body.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send({ data: card }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
      res.status(UNDEFINED_CODE).send({ message: 'Передан несуществующий _id карточки' });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
