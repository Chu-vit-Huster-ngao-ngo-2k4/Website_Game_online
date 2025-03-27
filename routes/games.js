const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

router.post("/add", async (req, res) => {
    try {
        const { title, iframe_url, thumbnail } = req.body;
        const newGame = await Game.create({
            title,
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
        const games = await Game.findAll();
        res.json(games);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách game:", error);
        res.status(500).json({ error: "Không thể lấy danh sách game!" });
    }
});


module.exports = router;