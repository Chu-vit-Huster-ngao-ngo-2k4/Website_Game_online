const jwt = require("jsonwebtoken");
const SECRET_KEY = "mySecretKey"; // Cần lưu trong biến môi trường

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    
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