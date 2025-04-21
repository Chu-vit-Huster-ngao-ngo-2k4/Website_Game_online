const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const authMiddleware = require("./middlewares/authMiddleware");


const authRoutes = require("./routes/auth");
const gamesRoutes = require("./routes/games"); // Sửa đường dẫn import

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/games", gamesRoutes);

const commentRoutes = require("./routes/comments");
app.use("/api/comments", authMiddleware, commentRoutes);



const PORT = process.env.PORT || 5000;


// Thêm options cho sequelize.sync()
sequelize.sync({ 
  force: false,
  alter: false
}).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server chạy trên port ${PORT}`));
}).catch(error => {
  console.error('Lỗi khi sync database:', error);
});