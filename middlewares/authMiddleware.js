const jwt = require("jsonwebtoken");

require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}


const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");
if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token không hợp lệ hoặc không tồn tại!" });
}
const token = authHeader.split(" ")[1]; // Lấy token sau "Bearer "

    
    if (!token) {
        return res.status(401).json({ error: "Truy cập bị từ chối!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.user = decoded; // Lưu thông tin user vào request
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token không hợp lệ!" });
    }
};

module.exports = authMiddleware;