const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Get comments (không cần auth)  
router.get('/game/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;
        console.log('Fetching comments for game:', gameId); // Debug log
        const comments = await Comment.findAll({
            where: { gameId },
            include: [{
                model: User,
                as: 'User',
                attributes: ['username']
            }],
            order: [['createdAt', 'DESC']]
        });
        console.log('Found comments:', comments); // Debug log
        res.json(comments);
    } catch (error) {
        console.error('Error loading comments:', error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Add comment (cần auth)
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { gameId, content } = req.body;
        const comment = await Comment.create({
            content,
            gameId,
            userId: req.user.id
        });
        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;