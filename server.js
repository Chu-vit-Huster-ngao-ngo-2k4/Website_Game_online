const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");


const authRoutes = require("./routes/auth");
const gamesRoutes = require("./routes/games"); // Sửa đường dẫn import
const commentRoutes = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/games", gamesRoutes);

app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server chạy trên port ${PORT}`));
});
