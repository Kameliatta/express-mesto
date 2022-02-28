const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { NotFoundError } = require('../utils/errors/not-found-err');
const { ConflictError } = require('../utils/errors/conflict-err');
const { UnauthorizedError } = require('../utils/errors/unauth-err');

const { NODE_ENV, JWT_KEY } = process.env;

const SOLT_ROUND = 10;

function checkError(user) {
  if (!user) {
    throw new NotFoundError('Пользователь с указанным _id не найден');
  }
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      checkError(user);
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.getProfileInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      checkError(user);
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(req.body.password, SOLT_ROUND)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      checkError(user);
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      checkError(user);
      res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_KEY : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });

      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new UnauthorizedError('Неверный email или пароль'));
      } else {
        next(err);
      }
    });
};
