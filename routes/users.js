const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUsersId,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUsersId);

router.post('/', createUser);

router.patch('/me', updateProfile);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
