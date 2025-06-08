const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken } = require('../middleware/auth');

// Get rating statistics for a game
router.get('/get/:gameId', ratingController.getRating);

// Add a new rating (requires authentication)
router.post('/add', verifyToken, ratingController.addRating);

// Update an existing rating (requires authentication)
router.put('/update/:ratingId', verifyToken, ratingController.updateRating);

module.exports = router; 