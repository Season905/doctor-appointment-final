const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser
} = require('../controllers/userController');
const { auth, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected routes
router.get('/me', auth, getUserProfile);
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);

// Admin routes
router.get('/', auth, admin, getUsers);
router.delete('/:id', auth, admin, deleteUser);
router.get('/:id', auth, admin, getUserById);
router.put('/:id', auth, admin, updateUser);

module.exports = router;
