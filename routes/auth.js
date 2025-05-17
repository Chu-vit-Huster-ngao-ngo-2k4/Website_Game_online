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
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
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
        const { username, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
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

// Check auth status
router.get('/check', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email']
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Error checking auth:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Change password
router.post('/change-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await user.update({ password: hashedPassword });

        res.json({ message: 'Mật khẩu đã được cập nhật thành công' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;