const Rating = require('../models/Rating');
const { Op } = require('sequelize');

const ratingController = {
    // Get rating statistics for a game
    async getRating(req, res) {
        try {
            const { gameId } = req.params;
            
            // Get all ratings for the game
            const ratings = await Rating.findAll({
                where: { gameId },
                include: [{
                    model: require('../models/User'),
                    attributes: ['username']
                }]
            });

            // Calculate average rating
            const average = ratings.length > 0 
                ? ratings.reduce((acc, curr) => acc + curr.score, 0) / ratings.length 
                : 0;

            // Get user's rating if authenticated
            let userRating = null;
            if (req.user) {
                const userRatingObj = ratings.find(r => r.userId === req.user.id);
                if (userRatingObj) {
                    userRating = {
                        id: userRatingObj.id,
                        score: userRatingObj.score
                    };
                }
            }

            res.json({
                average,
                count: ratings.length,
                userRating
            });
        } catch (error) {
            console.error('Error getting rating:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },

    // Add a new rating
    async addRating(req, res) {
        try {
            const { gameId, score } = req.body;
            const userId = req.user.id;

            // Check if user has already rated this game
            const existingRating = await Rating.findOne({
                where: {
                    userId,
                    gameId
                }
            });

            if (existingRating) {
                return res.status(400).json({ 
                    message: 'Bạn đã đánh giá game này rồi. Vui lòng cập nhật đánh giá thay vì tạo mới.' 
                });
            }

            // Create new rating
            const rating = await Rating.create({
                userId,
                gameId,
                score
            });

            res.status(201).json(rating);
        } catch (error) {
            console.error('Error adding rating:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    },

    // Update an existing rating
    async updateRating(req, res) {
        try {
            const { ratingId } = req.params;
            const { score } = req.body;
            const userId = req.user.id;

            // Find the rating
            const rating = await Rating.findOne({
                where: {
                    id: ratingId,
                    userId
                }
            });

            if (!rating) {
                return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
            }

            // Update the rating
            await rating.update({ score });

            res.json(rating);
        } catch (error) {
            console.error('Error updating rating:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
};

module.exports = ratingController;