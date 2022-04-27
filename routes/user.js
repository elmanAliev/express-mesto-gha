const router = require('express').Router();
const {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require('../controllers/user');

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
