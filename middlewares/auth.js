const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors/unauth-err');

const { NODE_ENV, JWT_KEY } = process.env;

module.exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_KEY : 'dev-secret');
  } catch (e) {
    const err = new UnauthorizedError('Необходима авторизация');

    next(err);
  }

  req.user = payload;

  next();
};
