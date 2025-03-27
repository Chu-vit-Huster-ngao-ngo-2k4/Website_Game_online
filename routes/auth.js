const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// Secret key để tạo JWT
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}



// Đăng ký tài khoản
router.post("/register", async (req, res) => {
    console.log("Dữ liệu nhận được:", req.body);

    const { username, email, password } = req.body;
    const validator = require('validator');

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Thiếu thông tin đăng ký!" });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Email không hợp lệ!" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Mật khẩu phải có ít nhất 6 ký tự!" });
    }

    // Kiểm tra email hoặc username đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: "Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu và lưu vào DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword
    });

    res.json({ message: "Đăng ký thành công!", user: newUser });
});

// API đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Kiểm tra user
        const user = await User.findOne({ where: { username } });
        if (!user || user.email !== email) {
            return res.status(400).json({ error: "Tài khoản hoặc email không đúng!" });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Mật khẩu không đúng!" });
        }

        // Tạo JWT Token
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "2h" });

        res.json({ message: "Đăng nhập thành công!", token });
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).json({ error: "Lỗi đăng nhập!" });
    }
});

// API lấy thông tin user (chỉ người dùng đã đăng nhập mới xem được)
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, { attributes: { exclude: ["password"] } });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Lỗi lấy thông tin người dùng!" });
    }
  });



// API đăng nhập
router.post("/login", async (req, res) => {
    try {
        const { username ,email, password } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: "Tài khoản không tồn tại!" });
        }

    // Kiểm tra email có khớp không
    if (user.email !== email) {
      return res.status(400).json({ error: "Email không đúng!" });
  }

        // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Mật khẩu không đúng!" });
        }

        // Tạo JWT Token
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: "2h",
        });

        res.json({ message: "Đăng nhập thành công!", token });
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        res.status(500).json({ error: "Lỗi đăng nhập!" });
    }
});


  module.exports = router;