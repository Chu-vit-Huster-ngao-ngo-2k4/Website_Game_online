const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const adminMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token không hợp lệ hoặc không tồn tại!" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Kiểm tra user có tồn tại và có quyền admin không
        const user = await User.findByPk(decoded.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: "Bạn không có quyền truy cập!" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token không hợp lệ!" });
    }
};

module.exports = adminMiddleware; 