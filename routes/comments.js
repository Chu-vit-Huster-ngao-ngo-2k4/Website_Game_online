const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

// Get comments for a game
router.get('/get/:gameId', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { gameId: req.params.gameId },
            include: [{
                model: User,
                as: 'User',
                attributes: ['id', 'username']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a comment
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { gameId, content } = req.body;
        
        if (!content) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const comment = await Comment.create({
            gameId,
            userId: req.user.id,
            content
        });

        // Get user info for the response
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username']
        });

        res.json({
            ...comment.toJSON(),
            User: user
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a comment
router.delete('/delete/:commentId', authMiddleware, async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user owns the comment
        if (comment.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.destroy();
        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;