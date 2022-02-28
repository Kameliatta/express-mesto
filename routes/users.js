const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getProfileInfo,
  getUsers,
  getUsersById,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getProfileInfo);

router.get('/:userId', getUsersById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .pattern(
        /https?:\/\/(www\.)?[-\w@:%.+~#=]{1,256}\.[a-z0-9()]{1,6}\b([-\w()@:%.+~#=//?&]*)/,
      ),
  }),
}), updateAvatar);

module.exports = router;
