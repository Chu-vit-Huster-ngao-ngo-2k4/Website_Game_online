const express = require("express");
const router = express.Router();
const { Comment, User, Game } = require("../models"); // Import models

// 📝 Thêm bình luận mới
router.post("/add", async (req, res) => {
    try {
        const { game_id, user_id, comment } = req.body;

        // Kiểm tra xem game có tồn tại không
        const gameExists = await Game.findByPk(game_id);
        if (!gameExists) {
            return res.status(404).json({ error: "Game không tồn tại!" });
        }

        // Kiểm tra xem user có tồn tại không
        const userExists = await User.findByPk(user_id);
        if (!userExists) {
            return res.status(404).json({ error: "Người dùng không tồn tại!" });
        }

        // Tạo bình luận mới
        const newComment = await Comment.create({ game_id, user_id, comment });

        res.json({
            message: "Bình luận đã được thêm!",
            comment: newComment
        });
    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
        res.status(500).json({ error: "Không thể thêm bình luận!" });
    }
});

// 📝 Lấy tất cả bình luận của một game
router.get("/game/:game_id", async (req, res) => {
    try {
        const { game_id } = req.params;

        const comments = await Comment.findAll({
            where: { game_id },
            include: [{ model: User, attributes: ["id", "username"] }],
            order: [["created_at", "DESC"]]
        });

        res.json(comments);
    } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
        res.status(500).json({ error: "Không thể lấy bình luận!" });
    }
});

// 📝 Xóa một bình luận theo ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Comment.destroy({ where: { id } });

        if (deleted) {
            res.json({ message: "Bình luận đã bị xóa!" });
        } else {
            res.status(404).json({ error: "Bình luận không tồn tại!" });
        }
    } catch (error) {
        console.error("Lỗi khi xóa bình luận:", error);
        res.status(500).json({ error: "Không thể xóa bình luận!" });
    }
});

module.exports = router;
