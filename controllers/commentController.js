const Comment = require('../models/Comment');
const User = require('../models/User');
const verifyToken = require('../middlewares/auth');

const commentController = {
    // Get comments for a game
    async getComments(req, res) {
        try {
            const { gameId } = req.params;
            const comments = await Comment.findAll({
                where: { gameId },
                include: [{
                    model: User,
                    attributes: ['username']
                }],
                order: [['createdAt', 'DESC']]
            });
            res.json(comments);
        } catch (error) {
            console.error('Error getting comments:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Add a new comment
    async addComment(req, res) {
        try {
            const { gameId, content } = req.body;
            const userId = req.user.id;

            if (!content) {
                return res.status(400).json({ message: 'Comment content is required' });
            }

            const comment = await Comment.create({
                userId,
                gameId,
                content
            });

            res.status(201).json({ 
                message: 'Comment added successfully',
                commentId: comment.id
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Delete a comment
    async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            const userId = req.user.id;

            const deleted = await Comment.destroy({
                where: {
                    id: commentId,
                    userId: userId
                }
            });

            if (!deleted) {
                return res.status(404).json({ message: 'Comment not found or unauthorized' });
            }

            res.json({ message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting comment:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = commentController; 