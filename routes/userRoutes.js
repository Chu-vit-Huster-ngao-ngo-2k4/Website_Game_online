const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');

// Change password
router.put('/change-password', verifyToken, userController.changePassword);

// Update profile
router.put('/update', verifyToken, userController.updateProfile);

// Delete account
router.delete('/delete', verifyToken, userController.deleteAccount);

module.exports = router; 