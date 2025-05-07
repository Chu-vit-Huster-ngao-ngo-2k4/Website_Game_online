const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/User");
const { Op } = require("sequelize");
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

// Đăng ký tài khoản admin (route đặc biệt)
router.post("/register-admin", async (req, res) => {
    const { username, email, password, adminKey } = req.body;
    const validator = require('validator');

    // Kiểm tra admin key
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ error: "Không có quyền tạo tài khoản admin!" });
    }

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

    try {
        // Kiểm tra email hoặc username đã tồn tại
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [{ email }, { username }]
            } 
        });
        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.email === email ? "Email đã tồn tại!" : "Username đã tồn tại!" 
            });
        }

        // Mã hóa mật khẩu và lưu vào DB
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.json({ 
            message: "Tạo tài khoản admin thành công!", 
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error("Lỗi khi tạo admin:", err);
        res.status(500).json({ error: "Lỗi khi tạo tài khoản admin!" });
    }
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

        // Tạo JWT Token với thông tin role
        const token = jwt.sign(
            { 
                id: user.id, 
                role: user.role 
            }, 
            SECRET_KEY, 
            { expiresIn: "2h" }
        );

        // Trả về thông tin user và token
        res.json({ 
            message: "Đăng nhập thành công!", 
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
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

module.exports = router;