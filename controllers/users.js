const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUsersId = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const ERROR_CODE = 400;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const ERROR_CODE = 400;
  const UNDEFINED_CODE = 404;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      res.status(UNDEFINED_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const ERROR_CODE = 400;
  const UNDEFINED_CODE = 404;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      res.status(UNDEFINED_CODE).send({ message: 'Пользователь с указанным _id не найден' });
      res.status(500).send({ message: 'Произошла ошибка' });
    });
};
