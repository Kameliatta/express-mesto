const Card = require('../models/card');
const { BadRequestError } = require('../utils/errors/bad-request-err');
const { NotFoundError } = require('../utils/errors/not-found-err');
const { ForbiddenError } = require('../utils/errors/forbidden-err');

function catchError(card) {
  if (!card) {
    throw new NotFoundError('Карточка с указанным _id не найдена');
  }
}

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      catchError(card);
      if (req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .then(() => {
            catchError(card);
            res.status(200).send({ message: 'Карточка удалена' });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не являетесь владельцем карточки');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
      res.send({ data: card });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      catchError(card);
      res.status(200).send({ data: card });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      catchError(card);
      res.status(200).send({ data: card });
    })
    .catch(next);
};
