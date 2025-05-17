const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", async (req, res) => {
    try{
        const gameId = req.query.id;
        if(gameId == null){
            const games = await Game.findAll();
            res.json(games);
        }else{
            const game = await Game.findOne({ where: { id: gameId } });
            res.json(game);
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách game:", error);
        res.status(500).json({ error: "Không thể lấy danh sách game!" });
    }
});

router.post("/add", adminMiddleware, async (req, res) => {
    try {
        const { title, category, iframe_url, thumbnail } = req.body;
        const newGame = await Game.create({
            title,
            category,
            iframe_url,
            thumbnail
        });
        res.json({
            message: "Thêm game thành công!",
            game: newGame
        });
    } catch (error) {
        console.error("Lỗi khi thêm game:", error);
        res.status(500).json({ error: "Không thể thêm game!" });
    }
});

router.get("/get", async (req, res) => {
    try {
        const gameId = req.query.id; // Lấy id từ query string

        if (gameId) {
            const game = await Game.findOne({ where: { id: gameId } });

            if (!game) {
                return res.status(404).json({ error: "Game không tồn tại!" });
            }

            return res.json(game); // Trả về game có id tương ứng
        }

        const games = await Game.findAll();
        res.json(games); // Nếu không có id, trả về tất cả game
    } catch (error) {
        console.error("Lỗi khi lấy danh sách game:", error);
        res.status(500).json({ error: "Không thể lấy danh sách game!" });
    }
});

router.get("/delete/:id", adminMiddleware, async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findByPk(gameId);

        if (!game) {
            return res.status(404).json({ error: "Game không tồn tại!" });
        }

        await game.destroy();
        res.json({ message: "Xóa game thành công!" });
    } catch (error) {
        console.error("Lỗi khi xóa game:", error);
        res.status(500).json({ error: "Không thể xóa game!" });
    }
});

// Get game by ID
router.get("/get/:id", async (req, res) => {
    try {
        const gameId = req.params.id;
        const game = await Game.findByPk(gameId);

        if (!game) {
            return res.status(404).json({ error: "Game không tồn tại!" });
        }

        res.json(game);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin game:", error);
        res.status(500).json({ error: "Không thể lấy thông tin game!" });
    }
});

// Update game
router.put('/update/:id', adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, iframe_url, thumbnail } = req.body;

        const game = await Game.findByPk(id);
        if (!game) {
            return res.status(404).json({ error: "Game không tồn tại!" });
        }

        await game.update({
            title,
            category,
            iframe_url,
            thumbnail
        });

        res.json({ message: "Cập nhật game thành công!", game });
    } catch (error) {
        console.error("Lỗi khi cập nhật game:", error);
        res.status(500).json({ error: "Không thể cập nhật game!" });
    }
});

module.exports = router;